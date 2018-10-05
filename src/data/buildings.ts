import { Building, EFunction, ELimitation, IBuilding } from '@/models/buildings';

const buildingInfos: IBuilding[] = [{
  description: '',
  icon: '村',
  limitations: [{ type: ELimitation.unique }],
  name: '太吾村'
}, {
  description: '',
  icon: '仓',
  name: '仓库'
}, {
  description: '',
  functions: [EFunction.fame, EFunction.others],
  icon: '祠',
  limitations: [{ type: ELimitation.unique }],
  name: '太吾氏祠堂'
}, {
  description: '',
  functions: [EFunction.gold, EFunction.fame, EFunction.others],
  icon: '驿',
  limitations: [{ type: ELimitation.unique }],
  name: '驿站'
}, {
  description: '',
  functions: [EFunction.pop],
  icon: '居',
  name: '居所'
}].map(d => ({
  backgroundColor: 'white',
  isArtificial: true,
  textColor: '',
  ...d
}));

const buildings = buildingInfos.map((data) => new Building(data));

export default buildings;