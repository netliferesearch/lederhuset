<?php
namespace Craft;

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
                $bodyBlocks = [];

                foreach ($entry->blocks as $block) {
                  $bodyBlocks[] = [
                    'title' => $block->title,
                  ];
                }

                return [
                  'id' => $entry->id,
                  'title' => $entry->title,
                  'url' => $entry->url,
                  'category' => [
                    'id' => $category->id,
                    'title' => $category->title,
                  ],
                  'blocks' => $bodyBlocks
                ];
            },
        ]
    ]
];
