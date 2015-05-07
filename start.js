var mmsCollectionsToArchivesCollections = require("./jobs/mms_collections_to_archives_collections.js"),
	mmsChildrenToArchivesComponents = require("./jobs/mms_children_to_archives_components.js")




mmsCollectionsToArchivesCollections.process({}, function(data){console.log(JSON.stringify(data,null, 2))})

//mmsChildrenToArchivesComponents.process()