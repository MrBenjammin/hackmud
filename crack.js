function(context, args)
{
	var lock_args = {};
	var lock_type;
	var ret;
	var t;
	
	//
	// Possible lock open strings
	//
	var unlock = ["unlock", "open", "release"]
	
	//
	// Regex to get lock type from error message
	//
	var re = /LOCK_ERROR.*Denied access.* (.*) lock/;
	var match = re.exec(args.npc.call({}).replace("\n","").trim());

	//
	// If we had a match on the regex, store the lock type for later use
	//
	if (match && match.length) {
		lock_type = match[1];
		
	}

	//
	// Else return failure
	//
	else {
		tell("Could not determine lock type!");
		return { ok:false };
	}

	//
	// Switch statement based on the type of lock we found
	//
	switch (true) {
		case /EZ_21/.test(lock_type):
			breakEz21();
			break;
			
		case /EZ_35/.test(lock_type):
			breakEz35();
			break;
			
		default:
			tell("Invalid lock type: " + lock_type + "!");
			return { ok:false };
	}
	
	tell(JSON.stringify(lock_args));
	return { ok:true };

	//
	// Attempt to break an EZ_21 lock
	//
	function breakEz21() {
		t = { ez_21:"" };
		lock_args.ez_21 = getUnlockString("ez_21");
	}
	
	//
	// Attempt to break an EZ_35 lock
	//
	function breakEz35() {
		t = { ez_35:"" };
		lock_args.ez_35 = getUnlockString("ez_35");
		
		//
		// Once we've found the unlock string, get the digit as well
		//
		for (var i = 0; i < 10; i++) {
			if (! /LOCK_ERROR.*correct digit/.test(args.npc.call({ ez_35: lock_args.ez_35, digit: i }).replace("\n", ""))) {
				lock_args.digit = i;
			}
		}
	}
	
	//
	// Find the correct unlock string
	//
	function getUnlockString(key) {
		//
		// Loop through possible unlock strings in an attempt to break the lock
		//
		for (var i = 0; i < unlock.length; i++) {
			t[key] = unlock[i];
			if (! /LOCK_ERROR.*correct unlock/.test(args.npc.call(t).replace("\n", ""))) {
				return unlock[i];
			}
		}		
	}

	//
	// Send a tell to the user with a message
	//
	function tell(s) {
		#s.chats.tell({ to:context.caller, msg:"CRACK --> " + s });
	}

}
