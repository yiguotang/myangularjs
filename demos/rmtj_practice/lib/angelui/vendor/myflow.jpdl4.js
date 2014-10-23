(function ($) {
    var myflow = $.myflow;

    $.extend(true, myflow.config.rect, {
        attr: {
            r: 8,
            fill: '#F6F7FF',
            stroke: '#03689A',
            "stroke-width": 2
        }
    });

    $.extend(true, myflow.config.tools.states, {
        start: {
            showType: 'image',
            type: 'start',
            name: { text: '<<start>>' },
            text: { text: '开始' },
            img: { src: 'lib/angelui/resources/workflow/images/48/start_event_empty.png', width: 48, height: 48 },
            attr: { width: 50, heigth: 50 },
            props: {
                task_def_key: { value: '' }
            }
        },
        end: { showType: 'image', type: 'end',
            name: { text: '<<end>>' },
            text: { text: '结束' },
            img: { src: 'lib/angelui/resources/workflow/images/48/end_event_terminate.png', width: 48, height: 48 },
            attr: { width: 50, heigth: 50 },
            props: {
                task_def_key: { value: '' }
            }
        },
        task: { showType: 'text', type: 'task',
            name: { text: '<<task>>' },
            text: { text: '任务' },
            img: { src: 'lib/angelui/resources/workflow/images/48/task_empty.png', width: 48, height: 48, id: "img_show"
            },
            props: {
                task_def_key: { value: '' }
            }
        },
        gateway: { showType: 'image', type: 'gateway',
            name: { text: '<<gateway>>' },
            text: { text: '网关' },
            img: { src: 'lib/angelui/resources/workflow/images/48/gateway_parallel.png', width: 48, height: 48 },
            props: {
                task_def_key: { value: '' }
            }
        }
    });
})(jQuery);