import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { OryClient } from '../services/oryClient';
import { RelationTuple } from '../types';
import { RefreshCw } from 'lucide-react';

export const AccessControl: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tuples, setTuples] = useState<RelationTuple[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await OryClient.permission.listTuples();
    setTuples(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || loading || tuples.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Nodes and Links processing
    const nodesMap = new Map();
    const links: any[] = [];

    tuples.forEach(t => {
      // Process Subject (can be user or subject set)
      let subjectLabel = t.subject_id;
      let subjectGroup = 'user';
      
      if (t.subject_set) {
        subjectLabel = `${t.subject_set.namespace}:${t.subject_set.object}`;
        subjectGroup = 'group';
      }

      if (!subjectLabel) subjectLabel = "Unknown";

      if (!nodesMap.has(subjectLabel)) {
        nodesMap.set(subjectLabel, { 
            id: subjectLabel, 
            group: subjectGroup, 
            r: subjectGroup === 'user' ? 20 : 25 
        });
      }

      // Process Object
      const objectId = `${t.namespace}:${t.object}`;
      if (!nodesMap.has(objectId)) {
        nodesMap.set(objectId, { id: objectId, group: 'object', r: 30 });
      }
      
      links.push({
        source: subjectLabel,
        target: objectId,
        relation: t.relation
      });
    });

    const nodes = Array.from(nodesMap.values());

    // Force Simulation setup
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(180))
      .force("charge", d3.forceManyBody().strength(-600))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(50));

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Arrow markers
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .join("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 38)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#64748b")
      .attr("d", "M0,-5L10,0L0,5");

    // Links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

    // Link Labels
    const linkLabel = svg.append("g")
      .selectAll("rect") // background for text
      .data(links)
      .join("g");

    linkLabel.append("text")
        .text((d: any) => d.relation)
        .attr("font-size", 10)
        .attr("fill", "#94a3b8")
        .attr("text-anchor", "middle")
        .attr("dy", -5)
        .style("text-shadow", "0px 0px 4px #0f172a");

    // Nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation));

    // Node Circles
    node.append("circle")
      .attr("r", (d: any) => d.r)
      .attr("fill", (d: any) => {
          if (d.group === 'user') return "#6366f1"; // Indigo
          if (d.group === 'group') return "#f59e0b"; // Amber
          return "#10b981"; // Emerald (Object)
      })
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 2)
      .style("cursor", "move");

    // Icons inside circles (simplified with text char for now)
    node.append("text")
      .text((d: any) => {
          if (d.group === 'user') return "U";
          if (d.group === 'group') return "G";
          return "R";
      })
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", 12)
      .style("pointer-events", "none");

    // Node Labels
    node.append("text")
      .text((d: any) => d.id)
      .attr("x", 0)
      .attr("y", (d: any) => d.r + 16)
      .attr("text-anchor", "middle")
      .attr("fill", "#cbd5e1")
      .attr("font-size", 10)
      .style("pointer-events", "none");

    // Simulation Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      linkLabel.selectAll("text")
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function drag(simulation: any) {
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, [tuples, loading]);

  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Access Control Graph (ReBAC)</h1>
            <p className="text-slate-400 text-sm md:text-base">Visualizing real-time Ory Keto relation tuples from the database.</p>
        </div>
        <button 
            onClick={fetchData} 
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            title="Refresh Data"
        >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative shadow-inner" ref={containerRef}>
        <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
            <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs text-slate-300">User</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-slate-300">Group / Set</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-300">Object (Resource)</span>
            </div>
        </div>
        
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
                <div className="text-indigo-400 font-mono animate-pulse">Fetching Keto Tuples...</div>
            </div>
        )}
        
        <svg ref={svgRef} className="w-full h-full cursor-move"></svg>
      </div>
    </div>
  );
};
