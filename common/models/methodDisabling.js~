module.exports = {
	disableAllMethodsBut: function (module, methodsToExpose)
	{
		if(module && module.sharedClass)
		{
		    methodsToExpose = methodsToExpose || [];

		    var modelName = module.sharedClass.name;
		    var methods = module.sharedClass.methods();
		    var relationMethods = [];
		    var hiddenMethods = [];

		    try
		    {
		        Object.keys(module.definition.settings.relations).forEach(function(relation)
		        {
		            relationMethods.push({ name: '__findById__' + relation, isStatic: false });
		            relationMethods.push({ name: '__destroyById__' + relation, isStatic: false });
		            relationMethods.push({ name: '__updateById__' + relation, isStatic: false });
		            relationMethods.push({ name: '__exists__' + relation, isStatic: false });
		            relationMethods.push({ name: '__link__' + relation, isStatic: false });
		            relationMethods.push({ name: '__get__' + relation, isStatic: false });
		            relationMethods.push({ name: '__create__' + relation, isStatic: false });
		            relationMethods.push({ name: '__update__' + relation, isStatic: false });
		            relationMethods.push({ name: '__destroy__' + relation, isStatic: false });
		            relationMethods.push({ name: '__unlink__' + relation, isStatic: false });
		            relationMethods.push({ name: '__count__' + relation, isStatic: false });
		            relationMethods.push({ name: '__delete__' + relation, isStatic: false });
		        });
		    } catch(err) {}

		    methods.concat(relationMethods).forEach(function(method)
		    {
		        var methodName = method.name;
		        if(methodsToExpose.indexOf(methodName) < 0)
		        {
		            hiddenMethods.push(methodName);
		            module.disableRemoteMethod(methodName, method.isStatic);
		        }
		    });

		    if(hiddenMethods.length > 0)
		    {
		        console.log('\nRemote mehtods hidden for', modelName, ':', hiddenMethods.join(', '), '\n');
		    }
		}
	}
}
