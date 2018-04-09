<?php
namespace Craft;

/*
return [
    'endpoints' => [
        'api.json' => [
            'elementType' => ElementType::Category,
            'criteria' => [
              'section' => article,
              'search' => (craft()->request->getParam('q'))
            ],
            'transformer' => function(CategoryModel $category) {
                return [
                  'id' => $category->id,
                  'title' => $category->title,
                  'posts' => [
                    'title' => '',
                    'url' => '',
                  ]
                ];
            },
        ]
    ]
];*/


return [
    'endpoints' => [
        'api.json' => [
            'elementType' => 'Entry',
            'criteria' => [
              'section' => article,
              'search' => (craft()->request->getParam('q'))
            ],
            'transformer' => function (EntryModel $entry) {
                $category = $entry->category->first();

                return [
                  'id' => $entry->id,
                  'title' => $entry->title,
                  'url' => $entry->url,
                  'category' => [
                    'id' => $category->id,
                    'title' => $category->title,
                  ]
                ];
            },
        ]
    ]
];
