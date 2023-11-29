



INSERT INTO sectors.usersector
    (username, is_terms_agreed, created_by, modified_by)
VALUES
    ('admin', true, 'system', 'system'),
    ('user', true, 'system', 'system')
    ;

    
INSERT INTO sectors.sector
    (user_id, sector_id, created_by, modified_by)
VALUES
    (3, 1, 'system', 'system'),
    (3, 43, 'system', 'system'),
    (2, 542, 'system', 'system'),
    (2, 5, 'system', 'system')
    ;
    

  
    

 
INSERT INTO sectors.parameter
    (id, parent_id, title)
VALUES
    (  1,   0, 'Manufacturing'),
    ( 19,   0, 'Construction materials'),
    ( 18,   0, 'Electronics and Optics'),
    (  6,   0, 'Food and Beverage'),
    (342,   6, 'Bakery &amp; confectionery products'),
    ( 43,   6, 'Beverages'),
    ( 42,   6, 'Fish &amp; fish products'),
    ( 40,   6, 'Meat &amp; meat products'),
    ( 39,   6, 'Milk &amp; dairy products'),
    (437,   6, 'Other'),
    (378,   6, 'Sweets &amp; snack food'),
    ( 13,   0, 'Furniture'),
    (389,  13, 'Bathroom/sauna'),
    (385,  13, 'Bedroom'),
    (390,  13, 'Children’s room'),
    ( 98,  13, 'Kitchen'),
    (101,  13, 'Living room'),
    (392,  13, 'Office'),
    (394,  13, 'Other (Furniture)'),
    (341,  13, 'Outdoor'),
    ( 99,  13, 'Project furniture'),
    ( 12,   0, 'Machinery'),
    ( 94,  12, 'Machinery components'),
    ( 91,  12, 'Machinery equipment/tools'),
    (224,  12, 'Manufacture of machinery'),
    ( 97,  12, 'Maritime'),
    (271,  97, 'Aluminium and steel workboats'),
    (269,  97, 'Boat/Yacht building'),
    (230,  97, 'Ship repair and conversion'),
    ( 93,  12, 'Metal structures'),
    (508,  12, 'Other'),
    (227,  12, 'Repair and maintenance service'),
    ( 11,   0, 'Metalworking'),
    ( 67,  11, 'Construction of metal structures'),
    (263,  11, 'Houses and buildings'),
    (267,  11, 'Metal products'),
    (542,  11, 'Metal works'),
    ( 75, 542, 'CNC-machining'),
    ( 62, 542, 'Forgings, Fasteners'),
    ( 69, 542, 'Gas, Plasma, Laser cutting'),
    ( 66, 542, 'MIG, TIG, Aluminum welding'),
    (  9,   0, 'Plastic and Rubber'),
    ( 54,   9, 'Packaging'),
    (556,   9, 'Plastic goods'),
    (559,   9, 'Plastic processing technology'),
    ( 55, 559, 'Blowing'),
    ( 57, 559, 'Moulding'),
    ( 53, 559, 'Plastics welding and processing'),
    (560,   9, 'Plastic profiles'),
    (  5,   0, 'Printing'),
    (148,   5, 'Advertising'),
    (150,   5, 'Book/Periodicals printing'),
    (145,   5, 'Labelling and packaging printing'),
    (  7,   0, 'Textile and Clothing'),
    ( 44,   7, 'Clothing'),
    ( 45,   7, 'Textile'),
    (  8,   0, 'Wood'),
    (337,   8, 'Other (Wood)'),
    ( 51,   8, 'Wooden building materials'),
    ( 47,   8, 'Wooden houses'),
    (  3,   0, 'Other'),
    ( 37,   3, 'Creative industries'),
    ( 29,   3, 'Energy technology'),
    ( 33,   3, 'Environment'),
    (  2,   0, 'Service'),
    ( 25,   2, 'Business services'),
    ( 35,   2, 'Engineering'),
    ( 28,   2, 'Information Technology and Telecommunications'),
    (581,  28, 'Data processing, Web portals, E-marketing'),
    (576,  28, 'Programming, Consultancy'),
    (121,  28, 'Software, Hardware'),
    (122,  28, 'Telecommunications'),
    ( 22,   2, 'Tourism'),
    (141,   2, 'Translation services'),
    ( 21,   2, 'Transport and Logistics'),
    (111,  21, 'Air'),
    (114,  21, 'Rail'),
    (112,  21, 'Road'),
    (113,  21, 'Water')
    ;



