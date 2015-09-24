/*globals window, FileReader, Image, Caman */

var Filterer = function (opts) {
  if (!opts) {
    opts = {
      input : document.getElementById('file')
    };
  }

  var flt = this;

  this.canvas = document.createElement('canvas');
  this.newCanvas = null;
  this.canvas.id = 'original';
  this.img = document.createElement('img');
  this.img.dataset.camanHidpiDisabled = true;
  this.processArea = document.getElementById(opts.target);

  this.readFile = function (e) {
    var inp = e.target;
    if (inp.files && inp.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        flt.img.src = e.target.result;
      };
      reader.readAsDataURL(inp.files[0]);
    }
  };

  this.loadImage = function () {
    flt.drawImage(this, flt.canvas);
  };

  this.drawImage = function (image, canvas) {
    canvas.width = image.width * window.devicePixelRatio;
    canvas.height = image.height * window.devicePixelRatio;
    canvas.getContext('2d').drawImage(image, 0, 0, image.width * window.devicePixelRatio, image.height * window.devicePixelRatio);

    flt.processArea.appendChild(canvas);
  };

  this.manipulate = function (filter) {
    flt.canvas.style.display = 'none';
    if (flt.newCanvas) {
      flt.processArea.removeChild(flt.newCanvas);
    }
    flt.newCanvas = flt.canvas.cloneNode(true);
    flt.newCanvas.dataset.camanHidpiDisabled = true;
    flt.newCanvas.id = 'new';
    flt.newCanvas.style.display = 'block';
    flt.drawImage(flt.img, flt.newCanvas);

    Caman(flt.newCanvas, function () {
      this[filter]().render();
    });
  };

  this.setupFilters = function (filter) {
    filter.addEventListener('click', function () {
      flt.manipulate(this.dataset.filter);
    });
  };
  // Init
  (function () {
    var i = 0;
    flt.input = document.getElementById(opts.input);
    flt.input.addEventListener('change', flt.readFile);
    flt.filters = document.getElementsByClassName(opts.filters);
    flt.img.addEventListener('load', flt.loadImage);

    for (i; i < flt.filters.length; i++) {
      flt.setupFilters(flt.filters[i]);
    }
  }());
};

var filter = new Filterer({input : 'file-input', target : 'photo', filters : 'filters'});
