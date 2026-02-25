import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface AgentStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  last_run: string;
  next_run: string;
  logs: string[];
}

interface TradingSignal {
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  target: number;
  stop: number;
  confidence: number;
  timestamp: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [agents, setAgents] = useState<Record<string, AgentStatus>>({});
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // API에서 데이터 가져오기
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 에이전트 상태
      const agentsRes = await fetch(`${API_URL}/api/agents`);
      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        setAgents(agentsData);
      }

      // 시그널
      const signalsRes = await fetch(`${API_URL}/api/trading/signals?limit=10`);
      if (signalsRes.ok) {
        const signalsData = await signalsRes.json();
        setSignals(signalsData);
      }

      // 메트릭
      const metricsRes = await fetch(`${API_URL}/api/metrics`);
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }
    } catch (err) {
      setError('API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchData();
    // 30초마다 자동 갱신
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const runAgent = async (agentName: string) => {
    try {
      const res = await fetch(`${API_URL}/api/agents/${agentName}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_name: agentName, action: 'start' })
      });
      if (res.ok) {
        fetchData(); // 상태 갱신
      }
    } catch (err) {
      console.error('Run agent error:', err);
    }
  };

  const stopAgent = async (agentName: string) => {
    try {
      const res = await fetch(`${API_URL}/api/agents/${agentName}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_name: agentName, action: 'stop' })
      });
      if (res.ok) {
        fetchData(); // 상태 갱신
      }
    } catch (err) {
      console.error('Stop agent error:', err);
    }
  };

  const runAnalysis = async (symbol: string) => {
    try {
      const res = await fetch(`${API_URL}/api/trading/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, timeframe: '1h' })
      });
      if (res.ok) {
        fetchData(); // 결과 갱신
      }
    } catch (err) {
      console.error('Analysis error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      <Head>
        <title>dongsu Agent Dashboard</title>
      </Head>

      {/* Header */}
      <header className="border-b border-[#30363D] bg-[#161B22] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">🤖 dongsu Agent Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#8B949E]">{new Date().toLocaleString()}</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#238636]"></div>
              <span className="text-sm">System Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-[#30363D] bg-[#161B22] min-h-screen">
          <nav className="p-4">
            {[
              { id: 'overview', label: '📊 Overview', icon: '' },
              { id: 'trading', label: '💹 Trading', icon: '' },
              { id: 'research', label: '🔍 Research', icon: '' },
              { id: 'onchain', label: '⛓️ On-Chain', icon: '' },
              { id: 'logs', label: '📋 Logs', icon: '' },
              { id: 'settings', label: '⚙️ Settings', icon: '' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#1F6FEB] text-white'
                    : 'hover:bg-[#21262D] text-[#8B949E]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-[#8B949E]">Loading...</div>
            </div>
          )}

          {error && (
            <div className="bg-[#F85149]/20 border border-[#F85149] rounded-lg p-4 mb-6">
              <div className="text-[#F85149] font-medium">⚠️ {error}</div>
              <button
                onClick={fetchData}
                className="mt-2 text-sm text-[#58A6FF] hover:underline"
              >
                다시 시도
              </button>
            </div>
          )}

          {!loading && !error && activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                  <div className="text-sm text-[#8B949E] mb-1">Active Agents</div>
                  <div className="text-3xl font-bold text-[#238636]">
                    {metrics?.active_agents || 0}/3
                  </div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                  <div className="text-sm text-[#8B949E] mb-1">Today's Signals</div>
                  <div className="text-3xl font-bold text-[#58A6FF]">
                    {signals.length}
                  </div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                  <div className="text-sm text-[#8B949E] mb-1">Win Rate (24h)</div>
                  <div className="text-3xl font-bold text-[#E3B341]">--%</div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                  <div className="text-sm text-[#8B949E] mb-1">ETH Price</div>
                  <div className="text-3xl font-bold">$1,890</div>
                </div>
              </div>

              {/* Agent Status */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg">
                <div className="px-4 py-3 border-b border-[#30363D]">
                  <h2 className="font-semibold">Agent Status</h2>
                </div>
                <div className="divide-y divide-[#30363D]">
                  {Object.entries(agents).map(([key, agent]) => (
                    <div key={key} className="px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${
                          agent.status === 'running' ? 'bg-[#238636]' :
                          agent.status === 'error' ? 'bg-[#F85149]' : 'bg-[#8B949E]'
                        }`}></div>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-[#8B949E]">
                            Last: {agent.last_run ? new Date(agent.last_run).toLocaleTimeString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => runAgent(key)}
                          className="px-3 py-1.5 bg-[#238636] hover:bg-[#2EA043] rounded text-sm"
                        >
                          Run Now
                        </button>
                        <button
                          onClick={() => stopAgent(key)}
                          className="px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] rounded text-sm"
                        >
                          Stop
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Signals */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg">
                <div className="px-4 py-3 border-b border-[#30363D]">
                  <h2 className="font-semibold">Recent Signals</h2>
                </div>
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-[#8B949E]">
                        <th className="pb-3">Time</th>
                        <th className="pb-3">Symbol</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3">Target</th>
                        <th className="pb-3">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {signals.map((signal, i) => (
                        <tr key={i} className="border-t border-[#30363D]">
                          <td className="py-3">{signal.timestamp}</td>
                          <td className="py-3 font-medium">{signal.symbol}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              signal.type === 'BUY' ? 'bg-[#238636]/20 text-[#238636]' : 'bg-[#F85149]/20 text-[#F85149]'
                            }`}>
                              {signal.type}
                            </span>
                          </td>
                          <td className="py-3">${signal.price.toFixed(2)}</td>
                          <td className="py-3">${signal.target.toFixed(2)}</td>
                          <td className="py-3">{signal.confidence}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trading' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Trading Agent Control</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                  <h3 className="font-medium mb-4">Manual Analysis</h3>
                  <div className="space-y-3">
                    <select 
                      id="analysis-symbol"
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2"
                    >
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                      <option value="SOL">SOL</option>
                    </select>
                    <button 
                      onClick={() => {
                        const symbol = (document.getElementById('analysis-symbol') as HTMLSelectElement)?.value;
                        runAnalysis(symbol);
                      }}
                      className="w-full bg-[#238636] hover:bg-[#2EA043] py-2 rounded"
                    >
                      Run Analysis
                    </button>
                  </div>
                </div>

                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                  <h3 className="font-medium mb-4">Position Simulation</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Capital ($)"
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2"
                    />
                    <button className="w-full bg-[#1F6FEB] hover:bg-[#388BFD] py-2 rounded">
                      Simulate
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                <h3 className="font-medium mb-4">Trading Journal</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-[#58A6FF] hover:underline">BTC_2026-02-25.md</a>
                  <a href="#" className="block text-[#58A6FF] hover:underline">ETH_2026-02-25.md</a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Research Agent</h2>
              
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                <h3 className="font-medium mb-4">Latest Alpha Report</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Generated:</span>
                    <span className="text-[#8B949E]">2026-02-25 14:57</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trending Coins:</span>
                    <span className="text-[#8B949E]">3 found</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Projects:</span>
                    <span className="text-[#8B949E]">8 found</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-[#238636] hover:bg-[#2EA043] py-2 rounded">
                  Run Research Now
                </button>
              </div>
            </div>
          )}

          {activeTab === 'onchain' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">On-Chain Analysis</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                  <div className="text-sm text-[#8B949E] mb-1">Gas (Standard)</div>
                  <div className="text-2xl font-bold">-- Gwei</div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                  <div className="text-sm text-[#8B949E] mb-1">ETH Price</div>
                  <div className="text-2xl font-bold">$1,890</div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                  <div className="text-sm text-[#8B949E] mb-1">Whale Alerts (24h)</div>
                  <div className="text-2xl font-bold">0</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">System Logs</h2>
              
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 font-mono text-sm">
                <div className="space-y-1">
                  <div className="text-[#8B949E]">[14:58:32] Trading Agent: ETH BUY signal generated</div>
                  <div className="text-[#8B949E]">[14:57:15] Research Agent: Alpha report generated</div>
                  <div className="text-[#8B949E]">[14:53:08] Trading Agent: BTC analysis complete</div>
                  <div className="text-[#8B949E]">[14:53:01] Trading Agent: Starting BTC analysis...</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Settings</h2>
              
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm text-[#8B949E] mb-2">Trading Fee Rate</label>
                  <input
                    type="text"
                    defaultValue="0.1%"
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8B949E] mb-2">Min Profit Target</label>
                  <input
                    type="text"
                    defaultValue="0.6%"
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8B949E] mb-2">Analysis Interval</label>
                  <select className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2">
                    <option>Every 1 hour</option>
                    <option>Every 4 hours</option>
                    <option>Every 6 hours</option>
                  </select>
                </div>
                <button className="w-full bg-[#238636] hover:bg-[#2EA043] py-2 rounded">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
