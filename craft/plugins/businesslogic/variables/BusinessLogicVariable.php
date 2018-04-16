<?php
namespace Craft;

/**
 * OFFICIAL DOCUMENTATION:
 * http://buildwithcraft.com/docs/plugins/variables
 */

/**
 * Business Logic Variable
 *
 * Variables are the easy stuff, the "low hanging fruit". This file gives you an easy way to
 * spit data out into your Twig templates. That data can take basically any form... whether it's
 * an array, a string, an integer, or even an object. Any type of PHP variable can be passed
 * through a Variable method back to your Twig template.
 *
 * While it's not always necessary, it is common practice to simply use your variables as a
 * wrapper for corresponding Service methods. Especially if you need to interact with the
 * database at all... don't do that here!
 */

class BusinessLogicVariable
{

    // Check if access cookie is set
    public function accessGranted()
    {
        $cookieName = md5('cookieNameToBeHashed');
        return array_key_exists($cookieName, $_COOKIE);
    }
	/**
	 * Whatever you want to output to a Twig tempate
	 * can go into a Variable method.
	 *
	 * HOW TO USE IT
	 * From any Twig template, call it like this:
	 *
	 *     {{ craft.businessLogic.exampleVariable }}
	 *
	 * Or, if your variable requires input from Twig:
	 *
	 *     {{ craft.businessLogic.exampleVariable(twigValue) }}
	 *
	 */
	public function exampleVariable($optional = null)
	{
		return "And away we go to the Twig template...";
	}

}
