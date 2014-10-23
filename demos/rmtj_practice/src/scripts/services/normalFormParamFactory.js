define(['app', 'angular'], function(app, angular){
	app.factory('normalFormParamFactory', function(){
		return {
			/**
				绑定表单配置信息
				localFromUrl:表单
				definitionId:流程配置id
				instanceId:流程实例id
				taskDefKey:步骤配置id
				taskId:步骤实例id
				startKey:流程startKey
				callback:表单展开回调
			*/

			buildFormParam: function(param){
				var definitionId = param.definitionId;
				var instanceId = param.instanceId;
				var taskDefKey = param.taskDefKey;
				var taskId = param.taskId;
				var startKey = param.startKey;
				var callback = param.callback;

				$http.get(appConfiguration.workflowURL, {
					param:{
						definitionId:definitionId,
						instanceId:instanceId,
						task_id:taskId,
						actDefid:taskDefKey
					}
				}).success(function(formInfo){
					if (callback != null) {
						callback({
							formData: formInfo.data,
							saveCallback: function(data, done){
								var submitData = {
									data: data,
									definition_id: definitionId,
									proc_inst_id: instanceId,
									task_def_key: taskDefKey,
									task_id: taskId,
									start_key: startKey,
									title: data.title
								};
								$log.debug(JSON.stringify(submitData));
								$http.post(appConfiguration.workflowFormSubmitURL, submitData)
									.success(function(res){
										if(angular.ifFunction(done)){
											done(res);
										}
									});
							},
							postFormCallback: function(data, done){
								var submitData = {
									biz_json: data.data,
									proc_inst_id: data.proc_inst_id,
									task_id: data.task_id
								};

								$http.post(appConfiguration.getRouteUserURL, submitData)
									.success(function(res){
										if(angular.isFunction(done)){
											done(res.data);
										}
									});
							},
						});
					};
				});
			};
		};
	})
});