var mmsCollectionsToArchivesCollections = require("./jobs/mms_collections_to_archives_collections.js"),
	mmsChildrenToArchivesComponents = require("./jobs/mms_children_to_archives_components.js"),
	catalogBnumberCheckMms = require("./jobs/validate_catalog_bnumbers_to_mms.js")
	catalogBnumberCheckArchives = require("./jobs/validate_catalog_bnumbers_to_archives.js")



catalogBnumberCheckArchives.process()

//catalogBnumberCheckMms.process()

//mmsCollectionsToArchivesCollections.process({}, function(data){console.log(JSON.stringify(data,null, 2))})
//mmsChildrenToArchivesComponents.process()

