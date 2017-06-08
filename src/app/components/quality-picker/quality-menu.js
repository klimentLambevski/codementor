import videojs from 'video.js';

const VjsMenu = videojs.getComponent('Menu');

class QualityMenu extends VjsMenu {

  addItem(component) {
    super.addItem(component);

    component.on('click', () => {
      let children = this.children();

      for (var i=0; i < children.length; i++) {
        var child = children[i];
        if (component !== child) {
          child.selected(false);
        }
      }

    });
  }

}

export default QualityMenu;