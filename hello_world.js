function(context, args)
{
	var caller = context.caller;
	var l = #s.scripts.lib();

	//var o = { to: caller, msg: args.msg };
	//return args.target.call(o);

	return args.scr.call(args.a);

	// return { ok:true, msg:"Some message..."};
	//return "`2Testing...`";
}
