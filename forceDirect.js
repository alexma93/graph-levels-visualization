
var primaVolta=true;
var svg;
var simulation;
var node;
var link;
var nodes;
var edges;
var alpha;
var edgeToRemove;

function stopFD() {
	simulation.stop();
}

function drawForceDirect(nodesFD,edgesFD,nodeRay){
	alpha = 0.3;
	nodes = nodesFD;
	edges = edgesFD;
	if (primaVolta==true) {
		primaVolta=false;
	} else {	
		svg.selectAll("*").remove();
	} 


	svg = d3.select("#svgForce"); 
	svg.attr("style", "border-style: solid");
	svgHeight = svg.node().getBoundingClientRect().height;
	svgWidth = svg.node().getBoundingClientRect().width;
	edgeToRemove = null;

	var color = colores_google;

	simulation = getForce();

	// definisco una freccia per gli archi
	svg.append('svg:defs').append('svg:marker')
	    .attr('id', 'end-arrow')
	    .attr('viewBox', '0 -5 10 10')
	    .attr('refX', 6)
	    .attr('markerWidth', 4)
	    .attr('markerHeight', 4)
	    .attr('orient', 'auto')
	  	.append('svg:path')
	    .attr('d', 'M0,-5L10,0L0,5');

	link = svg.selectAll(".edgeFD").data(edges).enter().append("path")
      				.attr("class", "edgeFD").attr("marker-end", "url(#end-arrow)");
	

	// stampo i nodi come un gruppo formato da cerchio e testo
	node = svg.selectAll(".nodeFD").data(nodes).enter().append("g").attr("class", "nodeFD")
			.call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragend));

	node.append("circle")
				.style("fill", function(d) { return colors(d.level); })
				.attr("r", nodeRay);
	node.append("text")
				.attr("text-anchor", "middle")
				.attr("dy", ".35em")
				.text(function(d) {return d.name});

}
 

function ticked() {
	link.attr('d', function(d){
		var deltaX = d.target.x - d.source.x,
        deltaY = d.target.y - d.source.y,
        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        normX = deltaX / dist,
        normY = deltaY / dist,
        sourcePadding = d.left ? 24 : 17,
        targetPadding = d.right ? 29 : 22,
        sourceX = d.source.x + (sourcePadding * normX),
        sourceY = d.source.y + (sourcePadding * normY),
        targetX = d.target.x - (targetPadding * normX),
        targetY = d.target.y - (targetPadding * normY);
        avgX = (sourceX + targetX ) *8/16;
        avgY = (sourceY + targetY ) *8/16; // qui cambio se voglio incurvare gli archi
    return 'M' + sourceX + ',' + sourceY + 'Q'+ avgX+" "+ avgY+',' + targetX + ' ' + targetY ;
	})
	.attr('fill','transparent');

	node.attr("transform", function(d, i) {return "translate(" + d.x + "," + d.y + ")";});
	//alpha = alpha - alpha/100;
	//simulation.alphaTarget(null);
};

function deleteNodeFD(nodeName) {
	// rimuovo gli archi dell'iterazione precedente
	if (edgeToRemove!=null)
		edgeToRemove.remove();

	d3.selectAll(".nodeFD").filter(function(d){return d.name==nodeName;}).nodes().forEach(function(d){
		d3.select(d.childNodes[0]).style("fill","#adadad");
		d3.select(d.childNodes[1]).attr("stroke-width","1").attr("stroke","white").attr("fill","white");
	});
	// levo i nodi senza piu archi entranti ne' uscenti
	d3.selectAll(".nodeFD").filter(function(d){
		var inEdg = d3.selectAll(".edgeFD").filter(function(t){return t.target.name==d.name;}).size();
		var outEdg = d3.selectAll(".edgeFD").filter(function(t){return t.source.name==d.name;}).size();
		return inEdg + outEdg == 0;
	}).remove();

	// rendo dotted gli archi verso i miei nodi target
	edgeToRemove = d3.selectAll(".edgeFD").filter(function(d){return d.source.name==nodeName;});
	edgeToRemove.attr("stroke-dasharray","5,5");
}

function resetFD() {
	svg.selectAll("*").remove();
	primaVolta = true;
}

function getForce() {
	var charge = document.getElementById("charge").value;
	var linkDistance = document.getElementById("linkDistance").value;
	var grav = document.getElementById("gravity").value;
	var linkStrength = document.getElementById("linkStrength").value;


	simulation = d3.forceSimulation(nodes) 
		    .force("charge", d3.forceManyBody().strength(charge)) // sto aggiustando questo
		    .force("link", d3.forceLink(edges).distance(linkDistance).strength(linkStrength))
		    .force("x", d3.forceX().strength(grav))
		    .force("y", d3.forceY().strength(grav))
		    .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2))
		    .alphaTarget(alpha)
		    .on("tick", ticked);
	return simulation;
}

function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.1).restart();
	d3.event.subject.fx = d3.event.subject.x;
	d3.event.subject.fy = d3.event.subject.y;
}

function dragged(d) {
	d3.event.subject.fx = d3.event.x;
	d3.event.subject.fy = d3.event.y;
}

function dragend(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d3.event.subject.fx = d.x;
	d3.event.subject.fy = d.y;

}

function gravity(alpha) {
  return function(d) {
    d.y += (d.cy - d.y) * alpha;
    d.x += (d.cx - d.x) * alpha;
  };
}

function colores_google(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}
