import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface AgentStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  lastRun: string;
  nextRun: string;
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

export default function Dashboard() {
  const [agents, setAgents] = useState<AgentStatus[]>([
    { name: 'Trading Agent', status: 'running', lastRun: '14:53', nextRun: '15:00', logs: ['ETH BUY signal generated', 'BTC analysis complete'] },
    { name: 'Research Agent', status: 'running', lastRun: '14:57', nextRun: '20:57', logs: ['Alpha report generated', '3 trending coins found'] },
    { name: 'On-Chain Agent', status: 'running', lastRun: '14:58', nextRun: '15:58', logs: ['Gas price checked', 'ETH price: $1,890'] },
  ]);

  const [signals, setSignals] = useState<TradingSignal[]>([
    { symbol: 'ETH', type: 'BUY', price: 1885.91, target: 1897.22, stop: 1829.33, confidence: 70, timestamp: '14:53' },
  ]);

  const [activeTab, setActiveTab] = useState('overview');

  const runAgent = (agentName: string) => {
    console.log(`Running ${agentName}...`);
    // TODO: API call to run agent
  };

  const stopAgent = (agentName: string) => {
    console.log(`Stopping ${agentName}...`);
    // TODO: API call to stop agent
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                  <div className="text-sm text-[#8B949E] mb-1">Active Agents</div>
                  <div className="text-3xl font-bold text-[#238636]">3/3</div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                  <div className="text-sm text-[#8B949E] mb-1">Today's Signals</div>
                  <div className="text-3xl font-bold text-[#58A6FF]">2</div>
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
                  {agents.map((agent) => (
                    <div key={agent.name} className="px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${
                          agent.status === 'running' ? 'bg-[#238636]' :
                          agent.status === 'error' ? 'bg-[#F85149]' : 'bg-[#8B949E]'
                        }`}></div>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-[#8B949E]">
                            Last: {agent.lastRun} | Next: {agent.nextRun}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => runAgent(agent.name)}
                          className="px-3 py-1.5 bg-[#238636] hover:bg-[#2EA043] rounded text-sm"
                        >
                          Run Now
                        </button>
                        <button
                          onClick={() => stopAgent(agent.name)}
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
                    <select className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2">
                      <option>BTC</option>
                      <option>ETH</option>
                      <option>SOL</option>
                    </select>
                    <button className="w-full bg-[#238636] hover:bg-[#2EA043] py-2 rounded">
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
