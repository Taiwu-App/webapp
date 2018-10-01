import { Building, EFunction, ELimitation, IBuilding } from '@/models/buildings';

const buildingInfos: IBuilding[] = [{
  description: '',
  limitations: [{ type: ELimitation.unique }],
  name: '太吾村'
}, {
  description: '',
  name: '仓库'
}, {
  description: '',
  functions: [EFunction.fame, EFunction.others],
  limitations: [{ type: ELimitation.unique }],
  name: '太吾氏祠堂'
}, {
  description: '',
  functions: [EFunction.gold, EFunction.fame, EFunction.others],
  limitations: [{ type: ELimitation.unique }],
  name: '驿站'
}, {
  description: '',
  functions: [EFunction.pop],
  name: '居所'
}];

const buildings = buildingInfos.map((data) => new Building(data));

export default buildings;