<?php
namespace Craft;

$criteria = craft()->elements->getCriteria(ElementType::Category);
$criteria->slug = $slug;
$category = $criteria->find();

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
