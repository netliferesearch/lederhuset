<?php
namespace Craft;

return [
    'endpoints' => [
        'api/search.json' => [
            'elementType' => 'Entry',
            'criteria' => ['section'],
            'transformer' => function (EntryModel $entry) {
                return [
                    'title' => $entry->title,
                    'url' => $entry->url,
                    'jsonUrl' => UrlHelper::getUrl("{$entry->id}.json")
                ];
            },
        ]
    ]
];
