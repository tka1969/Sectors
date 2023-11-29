import { IClassificator } from "../models/classificator.interface";
import { ClassificatorService } from "../services/classificator.service";


export function InitAppFactory(
    classificatorService: ClassificatorService
) {

  return async () => {
    //console.log('InitAppFactory - started');

    const sectorClassicators: IClassificator[] = [
      { Id:   1, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Manufacturing' },
      { Id:  19, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Construction materials' },
      { Id:  18, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Electronics and Optics' },
      { Id:   6, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Food and Beverage' },
      { Id: 342, ParentId:   6, ParameterClass: 'SECTORS', Name: 'Bakery & confectionery products' },
      { Id:  43, ParentId:   6, ParameterClass: 'SECTORS', Name: 'Beverages' },
      { Id:  42, ParentId:   6, ParameterClass: 'SECTORS', Name: 'Fish & fish products' },
      { Id:  40, ParentId:   6, ParameterClass: 'SECTORS', Name: 'Meat & meat products' },
      { Id:  39, ParentId:   6, ParameterClass: 'SECTORS', Name: 'Milk & dairy products' },
      { Id: 437, ParentId:   6, ParameterClass: 'SECTORS', Name: 'Other' },
      { Id: 378, ParentId:   6, ParameterClass: 'SECTORS', Name: 'Sweets & snack food' },
      { Id:  13, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Furniture' },
      { Id: 389, ParentId:  13, ParameterClass: 'SECTORS', Name: 'Bathroom/sauna' },
      { Id: 385, ParentId:  13, ParameterClass: 'SECTORS', Name: 'Bedroom' },
      { Id: 390, ParentId:  13, ParameterClass: 'SECTORS', Name: 'Children’s room' },
      { Id:  98, ParentId:  13, ParameterClass: 'SECTORS', Name: 'Kitchen' },
      { Id: 101, ParentId:  13, ParameterClass: 'SECTORS', Name: 'Living room' },
      { Id: 392, ParentId:  13, ParameterClass: 'SECTORS', Name: 'Office' },
      { Id: 394, ParentId:  13, ParameterClass: 'SECTORS', Name: 'Other { Id: Furniture)' },
      { Id: 341, ParentId:  13, ParameterClass: 'SECTORS', Name: 'Outdoor' },
      { Id:  99, ParentId:  13, ParameterClass: 'SECTORS', Name: 'Project furniture' },
      { Id:  12, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Machinery' },
      { Id:  94, ParentId:  12, ParameterClass: 'SECTORS', Name: 'Machinery components' },
      { Id:  91, ParentId:  12, ParameterClass: 'SECTORS', Name: 'Machinery equipment/tools' },
      { Id: 224, ParentId:  12, ParameterClass: 'SECTORS', Name: 'Manufacture of machinery' },
      { Id:  97, ParentId:  12, ParameterClass: 'SECTORS', Name: 'Maritime' },
      { Id: 271, ParentId:  97, ParameterClass: 'SECTORS', Name: 'Aluminium and steel workboats' },
      { Id: 269, ParentId:  97, ParameterClass: 'SECTORS', Name: 'Boat/Yacht building' },
      { Id: 230, ParentId:  97, ParameterClass: 'SECTORS', Name: 'Ship repair and conversion' },
      { Id:  93, ParentId:  12, ParameterClass: 'SECTORS', Name: 'Metal structures' },
      { Id: 508, ParentId:  12, ParameterClass: 'SECTORS', Name: 'Other' },
      { Id: 227, ParentId:  12, ParameterClass: 'SECTORS', Name: 'Repair and maintenance service' },
      { Id:  11, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Metalworking' },
      { Id:  67, ParentId:  11, ParameterClass: 'SECTORS', Name: 'Construction of metal structures' },
      { Id: 263, ParentId:  11, ParameterClass: 'SECTORS', Name: 'Houses and buildings' },
      { Id: 267, ParentId:  11, ParameterClass: 'SECTORS', Name: 'Metal products' },
      { Id: 542, ParentId:  11, ParameterClass: 'SECTORS', Name: 'Metal works' },
      { Id:  75, ParentId: 542, ParameterClass: 'SECTORS', Name: 'CNC-machining' },
      { Id:  62, ParentId: 542, ParameterClass: 'SECTORS', Name: 'Forgings, Fasteners' },
      { Id:  69, ParentId: 542, ParameterClass: 'SECTORS', Name: 'Gas, Plasma, Laser cutting' },
      { Id:  66, ParentId: 542, ParameterClass: 'SECTORS', Name: 'MIG, TIG, Aluminum welding' },
      { Id:   9, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Plastic and Rubber' },
      { Id:  54, ParentId:   9, ParameterClass: 'SECTORS', Name: 'Packaging' },
      { Id: 556, ParentId:   9, ParameterClass: 'SECTORS', Name: 'Plastic goods' },
      { Id: 559, ParentId:   9, ParameterClass: 'SECTORS', Name: 'Plastic processing technology' },
      { Id:  55, ParentId: 559, ParameterClass: 'SECTORS', Name: 'Blowing' },
      { Id:  57, ParentId: 559, ParameterClass: 'SECTORS', Name: 'Moulding' },
      { Id:  53, ParentId: 559, ParameterClass: 'SECTORS', Name: 'Plastics welding and processing' },
      { Id: 560, ParentId:   9, ParameterClass: 'SECTORS', Name: 'Plastic profiles' },
      { Id:   5, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Printing' },
      { Id: 148, ParentId:   5, ParameterClass: 'SECTORS', Name: 'Advertising' },
      { Id: 150, ParentId:   5, ParameterClass: 'SECTORS', Name: 'Book/Periodicals printing' },
      { Id: 145, ParentId:   5, ParameterClass: 'SECTORS', Name: 'Labelling and packaging printing' },
      { Id:   7, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Textile and Clothing' },
      { Id:  44, ParentId:   7, ParameterClass: 'SECTORS', Name: 'Clothing' },
      { Id:  45, ParentId:   7, ParameterClass: 'SECTORS', Name: 'Textile' },
      { Id:   8, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Wood' },
      { Id: 337, ParentId:   8, ParameterClass: 'SECTORS', Name: 'Other (Wood)' },
      { Id:  51, ParentId:   8, ParameterClass: 'SECTORS', Name: 'Wooden building materials' },
      { Id:  47, ParentId:   8, ParameterClass: 'SECTORS', Name: 'Wooden houses' },
      { Id:   3, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Other' },
      { Id:  37, ParentId:   3, ParameterClass: 'SECTORS', Name: 'Creative industries' },
      { Id:  29, ParentId:   3, ParameterClass: 'SECTORS', Name: 'Energy technology' },
      { Id:  33, ParentId:   3, ParameterClass: 'SECTORS', Name: 'Environment' },
      { Id:   2, ParentId:   0, ParameterClass: 'SECTORS', Name: 'Service' },
      { Id:  25, ParentId:   2, ParameterClass: 'SECTORS', Name: 'Business services' },
      { Id:  35, ParentId:   2, ParameterClass: 'SECTORS', Name: 'Engineering' },
      { Id:  28, ParentId:   2, ParameterClass: 'SECTORS', Name: 'Information Technology and Telecommunications' },
      { Id: 581, ParentId:  28, ParameterClass: 'SECTORS', Name: 'Data processing, Web portals, E-marketing' },
      { Id: 576, ParentId:  28, ParameterClass: 'SECTORS', Name: 'Programming, Consultancy' },
      { Id: 121, ParentId:  28, ParameterClass: 'SECTORS', Name: 'Software, Hardware' },
      { Id: 122, ParentId:  28, ParameterClass: 'SECTORS', Name: 'Telecommunications' },
      { Id:  22, ParentId:   2, ParameterClass: 'SECTORS', Name: 'Tourism' },
      { Id: 141, ParentId:   2, ParameterClass: 'SECTORS', Name: 'Translation services' },
      { Id:  21, ParentId:   2, ParameterClass: 'SECTORS', Name: 'Transport and Logistics' },
      { Id: 111, ParentId:  21, ParameterClass: 'SECTORS', Name: 'Air' },
      { Id: 114, ParentId:  21, ParameterClass: 'SECTORS', Name: 'Rail' },
      { Id: 112, ParentId:  21, ParameterClass: 'SECTORS', Name: 'Road' },
      { Id: 113, ParentId:  21, ParameterClass: 'SECTORS', Name: 'Water' }
    ]

    classificatorService.put(sectorClassicators);
    //console.log('InitParameterFactory - completed');
  };

}

