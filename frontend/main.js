/**
* global config 
*/
const url = "http://localhost:3000"

const color_set = ["#dd6b66",
    "#759aa0",
    "#e69d87",
    "#8dc1a9",
    "#ea7e53",
    "#eedd78",
    "#73a373",
    "#73b9bc",
    "#7289ab",
    "#91ca8c",
    "#f49f42"
]

const stack = [];

// return a graph
const graph = (() => {

    // create a G6 graph instance 
    const g = (() => {
        /*         G6.registerBehavior('node-activate', {
    
                getDefaultCfg() {
                    return {
                        multiple: true
                    };
                },
            }); */

        const graph = new G6.Graph({
            container: 'mountNode',
            width: window.screen.availWidth,
            height: document.body.clientHeight,

            modes: {
                default: ['drag-node', 'node-activate'],
            },

            layout: {
                type: 'force',
                center: [window.screen.availWidth * 0.45, document.body.clientHeight * 0.4],
                preventOverlap: true,
                linkDistance: 180,
            },

            defaultNode: {
                size: 28,
                color: '#5B8FF9',
                style: {
                    lineWidth: 2,
                    fill: '',
                    stroke: '',
                },
                label: 'node-label',
                labelCfg: {
                    position: 'top',
                    style: {
                        fill: '#ddd',
                    },
                }

            },
            defaultEdge: {
                size: 1,
                color: '#aaa',
                label: 'node-label',
                labelCfg: {
                    style: {
                        fill: '#ddd',
                        stroke: '',
                    },
                },
            }
        });

        function updateNodePostion(e) {
            const model = e.item.get('model');
            model.fx = e.x;
            model.fy = e.y;
        }

        graph.on('node:dragstart', (e) => {
            graph.layout();
            updateNodePostion(e);
        });
        graph.on('node:drag', (e) => {
            updateNodePostion(e);
        });

        return graph;
    })();

    // install alice methods on g
    g.alice = async (para) => {
        const q = 'MATCH (n{name:"' + para + '"})-[a]-(x) RETURN n,labels(n),a,type(a),x,labels(x) LIMIT 100';
        // n returns a object
        // labels return a array
        // type returns a string

        // set node style 
        function setStyle(data) { // data is G6 data = {nodes, edges}
            const nodes = data.nodes;
            nodes.forEach((node) => {
                node.style = {
                    fill: color_set[node.id % color_set.length], // random color...
                    stroke: '',
                };
                switch (node.type) {
                    case ('IP' || 'Mail'):
                        {
                            node.size = 48;
                            break;
                        }
                    case 'DLL' || 'URL':
                        {
                            node.size = 36;
                            break;
                        }
                }
            });
        }

        // transform from res to G6 data
        function transform(res) {
            nodes = [];
            edges = [];

            const records = res.data.records;

            const subject = {
                id: '0',
                label: records[0]._fields[0].properties.name,
                type: records[0]._fields[1][0]
            }
            nodes.push(subject);

            for (let i = 1; i < records.length; i++) {
                edges.push({
                    source: '0',
                    target: i.toString(),
                    label: records[i]._fields[3]
                });
                nodes.push({
                    id: i.toString(),
                    label: records[i]._fields[4].properties.name,
                    type: records[i]._fields[5][0]
                })
            }

            return {
                'nodes': nodes,
                'edges': edges,
            };
        }

        // render the graph
        const res = await axios.get(`${url}?query=${q}`);
        const data = transform(res); // tranform from res to G6 data
        setStyle(data);
        graph.data(data);
        graph.render();
    }

    // register node:click behavior on g
    g.on('node:click', (e) => {
        g.alice(e.item.getModel().label);
    });

    return g;
})();

graph.alice(new URLSearchParams(window.location.search).get('name'));