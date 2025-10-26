export const locales = ['en', 'fr'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export const translations = {
  en: {
    nav: {
      home: 'Home',
      scavengerHunt: 'Scavenger Hunt',
      about: 'About Us',
      login: 'Login',
      signup: 'Sign Up',
      signOut: 'Sign Out'
    },
    home: {
      title: 'How do I touch grass',
      subtitle: 'Get active and reconnect with nature through our interactive scavenger hunt game',
      description: 'TouchGrass helps you step away from screens and discover the natural world around you. Our scavenger hunt challenges will get you moving, exploring, and appreciating the beauty of nature.',
      startButton: 'Start Scavenger Hunt',
      features: {
        title: 'Why TouchGrass?',
        outdoor: {
          title: 'Get Outdoors',
          description: 'Break free from indoor routines and explore the natural world around you.'
        },
        active: {
          title: 'Stay Active',
          description: 'Our challenges encourage movement and physical activity in nature.'
        },
        mindful: {
          title: 'Be Mindful',
          description: 'Connect with nature and practice mindfulness through observation.'
        },
        fun: {
          title: 'Have Fun',
          description: 'Enjoy gamified nature exploration with friends and family.'
        }
      }
    },
    auth: {
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      loginButton: 'Sign In',
      signupButton: 'Create Account',
      loginTitle: 'Welcome Back',
      signupTitle: 'Join TouchGrass'
    },
    scavengerHunt: {
      title: 'Nature Scavenger Hunt',
      startButton: 'Start Hunt',
      prompt: 'Find: ',
      cameraButton: 'Open Camera',
      captureButton: 'Capture Photo',
      sendButton: 'Send to API',
      retakeButton: 'Retake Photo',
      success: 'Great job! You found it!',
      failure: 'Try again! Keep looking.',
      prompts: [
        'Find a leaf',
        'Find a tree',
        'Find a flower',
        'Find a rock',
        'Find a bird',
        'Find a spider web',
        'Find moss',
        'Find a stick',
        'Find grass',
        'Find a cloud'
      ]
    },
    about: {
      title: 'About Our Team',
      name1: 'Eddie',
      name2: 'Micah',
      name3: 'Vepaul',
      name4: 'Tarun'
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      scavengerHunt: 'Chasse au Trésor',
      about: 'À Propos',
      login: 'Connexion',
      signup: 'Inscription',
      signOut: 'Se Déconnecter'
    },
    home: {
      title: 'Comment toucher l\'herbe',
      subtitle: 'Soyez actif et reconnectez-vous avec la nature grâce à notre jeu de chasse au trésor interactif',
      description: 'TouchGrass vous aide à vous éloigner des écrans et à découvrir le monde naturel qui vous entoure. Nos défis de chasse au trésor vous feront bouger, explorer et apprécier la beauté de la nature.',
      startButton: 'Commencer la Chasse au Trésor',
      features: {
        title: 'Pourquoi TouchGrass?',
        outdoor: {
          title: 'Sortir Dehors',
          description: 'Libérez-vous des routines intérieures et explorez le monde naturel qui vous entoure.'
        },
        active: {
          title: 'Rester Actif',
          description: 'Nos défis encouragent le mouvement et l\'activité physique dans la nature.'
        },
        mindful: {
          title: 'Être Conscient',
          description: 'Connectez-vous avec la nature et pratiquez la pleine conscience par l\'observation.'
        },
        fun: {
          title: 'S\'Amuser',
          description: 'Profitez de l\'exploration gamifiée de la nature avec vos amis et votre famille.'
        }
      }
    },
    auth: {
      login: 'Connexion',
      signup: 'Inscription',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      loginButton: 'Se connecter',
      signupButton: 'Créer un compte',
      loginTitle: 'Bon retour',
      signupTitle: 'Rejoindre TouchGrass'
    },
    scavengerHunt: {
      title: 'Chasse au Trésor Nature',
      startButton: 'Commencer la Chasse',
      prompt: 'Trouvez: ',
      cameraButton: 'Ouvrir la Caméra',
      captureButton: 'Capturer la Photo',
      sendButton: 'Envoyer à l\'API',
      retakeButton: 'Reprendre la Photo',
      success: 'Excellent travail! Vous l\'avez trouvé!',
      failure: 'Essayez encore! Continuez à chercher.',
      prompts: [
        'Trouvez une feuille',
        'Trouvez un arbre',
        'Trouvez une fleur',
        'Trouvez une pierre',
        'Trouvez un oiseau',
        'Trouvez une toile d\'araignée',
        'Trouvez de la mousse',
        'Trouvez un bâton',
        'Trouvez de l\'herbe',
        'Trouvez un nuage'
      ]
    },
    about: {
      title: 'À Propos de Notre Équipe',
      name1: 'Eddie',
      name2: 'Micah',
      name3: 'Vepaul',
      name4: 'Tarun'
    }
  }
}

export function getTranslations(locale: Locale) {
  return translations[locale] || translations[defaultLocale]
}