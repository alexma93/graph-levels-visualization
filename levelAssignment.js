
function longestPathLevelAssignment(nodes) {

	// mi salvo i pozzi in una lista
	var sinks = []
	for(var i=0;i<nodes.length;i++)
		if(nodes[i].edges.length==0) {
			sinks[sinks.length] = nodes[i];
			nodes[i].isSink = true;
		}

	for(var i=0;i<nodes.length;i++) {
		// calcolo per ogni nodo la distanza massima da ogni pozzo
		var node = nodes[i];
		//console.log("iterazione del nodo",node.name);
		var maxDist = 0;
		if(node.isSink)
			node.level = 0;
		else {
			for(var j=0;j<sinks.length;j++) {
				var sink = sinks[j];
				var distance = maxDistance(node,sink.name,nodes);
				if(distance > maxDist)
					maxDist = distance;
			}
		}
		node.level = maxDist; 
	}
}

function maxDistance(node,idTarget,nodes) {
	var edges = node.edges;
	var maxDist = -1;
	for(var i=0;i<edges.length;i++) {
		if (edges[i].name==idTarget)
			maxDist = Math.max(1,maxDist);
		else if (edges[i].level != -1) // se so gia' la distanza massima da quel nodo
			maxDist = Math.max(maxDist,1+edges[i].level);
		else
			maxDist = Math.max(maxDist,maxDistance(edges[i],idTarget,nodes)+1);
	}

	return maxDist;
}

