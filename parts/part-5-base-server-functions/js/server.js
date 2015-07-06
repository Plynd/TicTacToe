
// Very simple function that automatically invokes the success callback with a "hello" message
Plynd.ServerFunctions.hello = function(args, success, error) {
    success({message:"Hello " + args.name});
};