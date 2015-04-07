var mmsCollectionsToArchivesCollections = require("./jobs/mms_collections_to_archives_collections.js")



mmsCollectionsToArchivesCollections.process({}, function(data){console.log(JSON.stringify(data,null, 2))})