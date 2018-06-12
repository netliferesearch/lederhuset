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
                    'id' => (isset($category->id)) ? $category->id : '',
                    'title' => (isset($category->title)) ? $category->title : '',
                  ],
                  'blocks' => $bodyBlocks
                ];
            },
        ],
        'resourcesApi.json' => [
          'elementType' => 'Entry',
          'criteria' => ['section' => 'templatesAndResources'],
          'transformer' => function (EntryModel $entry) {
            $category = $entry->templatesAndResourcesCategory->first();
            $file = $entry->file->first();
            $bodyBlocks = [];

            foreach ($entry->blocks as $block) {
              $bodyBlocks[] = [
                'title' => $block->title,
              ];
            }

            return [
              'id' => $entry->id,
              'title' => $entry->title,
              'description' => $entry->description,
              'file' => $file ? $file->url : null,
              'category' => [
                'title' => $category->title,
              ]
            ];
          },
        ],
    ]
];
