<?php
/**
 * @author    Helle Holmsen
 * @copyright Copyright (c) 2018 Helle Holmsen
 * @link      https://github.com/helleholmsen
 * @package   AjaxSearch
 * @since     1.0.0
 */

namespace Craft;

class AjaxSearch_SearchEntryController extends BaseController
{

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     * @access protected
     */
    protected $allowAnonymous = array('actionIndex',
        );

    /**
     * Handle a request going to our plugin's index action URL, e.g.: actions/ajaxSearch
     */
    public function actionIndex(){
			$criteria = new ElementCriteriaModel(ElementType::Entry);
			// build your criteriaModel based on your needs
			$html = $this->renderTemplate('results.twig', array(
				'entries' => $criteria->find()
			));
			return $this->returnJson($html);			
    }

}
