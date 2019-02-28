MATCH (georgian:Course {name: "Georgian"})
CREATE (building_software:Activity {name: "Building Software", image: "building_software.png"})<-[:HAS_ACTIVITY {index: 0}]-(georgian)
RETURN building_software;