import Adapt from 'core/js/adapt';
import device from 'core/js/device';
import ComponentView from 'core/js/views/componentView';

class TabsView extends ComponentView {

  events () {
    return {
      'click .js-tabs-audio-navigation': 'onTabItemClicked'
    };
  }

  initialize(...args) {
    super.initialize(...args);
  }

  preRender() {
    this.listenTo(Adapt, {
      'device:resize': this.setLayout,
      'audio:changeText': this.replaceText
    });

    this.listenTo(this.model.getChildren(), {
      'change:_isActive': this.onItemsActiveChange,
      'change:_isVisited': this.onItemsVisitedChange
    });

    this.checkIfResetOnRevisit();
  }

  onItemsActiveChange(item, isActive) {
    if (!isActive) return;
    this.setStage(item);
  }

  postRender() {
    const items = this.model.getChildren();
    if (!items || !items.length) return;

    let activeItem = this.model.getActiveItem();
    if (!activeItem) {
      activeItem = this.model.getItem(0);
      activeItem.toggleActive(true);
    } else {
      // manually trigger change as it is not fired on reentry
      items.trigger('change:_isActive', activeItem, true);
    }

    this.setLayout();

    if (Adapt.audio && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
      this.replaceText(Adapt.audio.textSize);
    }

    this.$('.tabs-audio__widget').imageready(this.setReadyStatus.bind(this));
    if (this.model.get('_setCompletionOn') !== 'inview') return;
    this.setupInviewCompletion('.component__widget');
  }

  checkIfResetOnRevisit() {
    const isResetOnRevisit = this.model.get('_isResetOnRevisit');
    // If reset is enabled set defaults
    if (isResetOnRevisit) {
      this.model.reset(isResetOnRevisit);
    }
  }

  setLayout() {
    this.$el.removeClass('tabs-audio-layout-left tabs-audio-layout-top');

    if (device.screenSize == 'large') {
      this.$el.addClass('tabs-audio-layout-' + this.model.get('_tabLayout'));
    } else {
      this.$el.addClass('tabs-audio-layout-left');
    }

    // Check if just an image or just text is used in an item
    for (let i = 0; i < this.model.get('_items').length; i++) {
      if (this.model.get('_items')[i]._graphic.src == "" || this.model.get('_items')[i].body == "") {
        this.$('.item-' + i).addClass("fullwidth");
      }
    }
  }

  onTabItemClicked(event) {
    const index = $(event.currentTarget).index();

    this.model.setActiveItem(index);
    this.model.getItem(index).toggleVisited(true);

    const currentItem = this.getCurrentItem(index);

    ///// Audio /////
    if (Adapt.audio && this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status == 1) {
      // Reset onscreen id
      Adapt.audio.audioClip[this.model.get('_audio')._channel].onscreenID = "";
      // Trigger audio
      Adapt.trigger('audio:playAudio', currentItem._audio.src, this.model.get('_id'), this.model.get('_audio')._channel);
    }
  }

  getCurrentItem(index) {
    return this.model.get('_items')[index];
  }

  onItemsVisitedChange(item, _isVisited) {
    if (!_isVisited) return;

    this.$(`[data-index="${item.get('_index')}"]`).addClass('is-visited');

    // Append the word 'visited' to the item's aria-label
    const visitedLabel = this.model.get('_globals')._accessibility._ariaLabels.visited + '.';
    this.$(`[data-index="${item.get('_index')}"]`).find('.aria-label').each(function(index, ariaLabel) {
      ariaLabel.innerHTML += ' ' + visitedLabel;
    });
  }

  setStage(item) {
    const index = item.get('_index');
    const indexSelector = `[data-index="${index}"]`;

    item.toggleVisited(true);

    const $items = this.$('.tabs-audio-item');
    $items.removeClass('is-active');

    const $item = $items.eq(index);
    $item.addClass('is-active');
  }

  // Reduced text
  replaceText(value) {
    // If enabled
    if (Adapt.audio && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
      // Change each items title and body
      for (let i = 0; i < this.model.get('_items').length; i++) {
        if (value == 0) {
          this.$('.tabs-audio__navigation-item-inner').eq(i).html(this.model.get('_items')[i].tabTitle);
          this.$('.tabs-audio-item__title-inner').eq(i).html(this.model.get('_items')[i].title);
          this.$('.tabs-audio-item__body-inner').eq(i).html(this.model.get('_items')[i].body);
        } else {
          this.$('.tabs-audio__navigation-item-inner').eq(i).html(this.model.get('_items')[i].tabTitleReduced);
          this.$('.tabs-audio-item__title-inner').eq(i).html(this.model.get('_items')[i].titleReduced);
          this.$('.tabs-audio-item__body-inner').eq(i).html(this.model.get('_items')[i].bodyReduced);
        }
      }
    }
  }
}

TabsView.template = 'tabs';

export default TabsView;
