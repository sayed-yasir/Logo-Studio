(function (root) {
  'use strict';
  root.LogoStudioLogoTypes = {
    symbol:{label:'Symbol Mark',composition:'symbol-only',needsWordmark:false},
    wordmark:{label:'Wordmark',composition:'wordmark-only',needsWordmark:true},
    lettermark:{label:'Lettermark',composition:'initials',needsWordmark:true},
    monogram:{label:'Monogram',composition:'interlocking-initials',needsWordmark:true},
    abstract:{label:'Abstract Mark',composition:'non-literal-symbol',needsWordmark:false},
    combination:{label:'Combination Mark',composition:'symbol-plus-wordmark',needsWordmark:true},
    emblem:{label:'Emblem',composition:'contained-mark',needsWordmark:true},
    negativeSpace:{label:'Negative Space',composition:'dual-reading-mark',needsWordmark:false},
    geometric:{label:'Geometric Mark',composition:'constructed-geometry',needsWordmark:false},
    symbolFusion:{label:'Symbol Fusion',composition:'fused-symbol-system',needsWordmark:false},
    modular:{label:'Modular Mark',composition:'repeatable-modules',needsWordmark:false},
    signature:{label:'Signature Mark',composition:'expressive-wordmark',needsWordmark:true},
    architectural:{label:'Architectural Mark',composition:'structural-symbol',needsWordmark:false}
  };
})(window);
