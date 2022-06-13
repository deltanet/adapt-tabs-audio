import Adapt from 'core/js/adapt';
import TabsModel from './tabsModel';
import TabsView from './tabsView';

export default Adapt.register('tabs-audio', {
  model: TabsModel,
  view: TabsView
});
