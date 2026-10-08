(function (root) {
  'use strict';
  root.LogoStudioRules = {
    applications: {
      website:{label:'Website', requirements:['clear at medium size','works on light and dark surfaces']},
      mobileApp:{label:'Mobile App / App Icon', requirements:['strong square silhouette','recognizable at small size','avoid fine detail']},
      instagram:{label:'Instagram', requirements:['works in circular crop','strong central silhouette']},
      youtube:{label:'YouTube', requirements:['strong thumbnail silhouette','legible at small size']},
      tiktok:{label:'TikTok', requirements:['high contrast','strong avatar silhouette']},
      tshirt:{label:'T-Shirt', requirements:['screen-print friendly','limited fine detail']},
      hoodie:{label:'Hoodie', requirements:['bold silhouette','print-friendly construction']},
      packaging:{label:'Packaging', requirements:['clear at multiple scales','print-friendly']},
      businessCard:{label:'Business Card', requirements:['precise small-size typography','clean negative space']},
      storeSign:{label:'Store Sign', requirements:['distance legibility','strong silhouette']},
      billboard:{label:'Billboard', requirements:['fast recognition','high contrast']},
      product:{label:'Product', requirements:['works as physical mark','material-aware version']},
      vehicle:{label:'Vehicle', requirements:['distance recognition','simple bold geometry']},
      building:{label:'Building / Facade', requirements:['large-scale silhouette','architectural clarity']}
    },
    complexity: {
      simple:{logic:'minimal elements, strong silhouette, no unnecessary micro-detail'},
      controlled:{logic:'moderate structural detail with clear hierarchy'},
      expressive:{logic:'more distinctive form language while preserving recognition'},
      intricate:{logic:'controlled detail reserved for large-scale or premium applications'}
    },
    personality: {
      trustworthy:'balanced proportions, stable geometry, restrained contrast',
      confident:'decisive silhouette, controlled scale contrast, clear hierarchy',
      playful:'friendly geometry, subtle rhythm, approachable character',
      premium:'refined proportion, restrained detail, custom typography',
      technical:'precise construction, modular logic, controlled spacing',
      bold:'strong massing, decisive angles, high silhouette contrast',
      elegant:'refined curves, deliberate spacing, graceful proportions',
      innovative:'unexpected relationship between familiar forms, distinctive construction',
      warm:'soft transitions, human proportions, welcoming visual rhythm',
      energetic:'directional movement, active geometry, clear focal point'
    }
  };
})(window);
