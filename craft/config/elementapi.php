<?php
namespace Craft;

return [
    'endpoints' => [
        'api/search.json' => [
            'elementType' => 'Entry',
            'criteria' => [
              'section',
              'search' => (craft()->request->getParam('q'))
            ],
            'transformer' => function (EntryModel $entry) {
                return [
                  'title' => $entry->title,
                  'url' => $entry->url,
                  'searchUrl' => '/search?q=' . craft()->request->getParam('q'),
                  'jsonUrl' => UrlHelper::getUrl("{$entry->id}.json")
                ];
            },
        ]
    ]
];
