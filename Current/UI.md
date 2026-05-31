<!-- DocLab: Settings -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>DocLab - Settings</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&amp;family=JetBrains+Mono:wght@400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "log-bg": "#0a0a0a",
                        "surface-container": "#f1edec",
                        "tertiary-container": "#1c1b1a",
                        "on-secondary-fixed": "#1a1c1c",
                        "primary-container": "#1c1b1b",
                        "text-disabled": "#a3a3a3",
                        "primary": "#000000",
                        "surface-container-low": "#f7f3f2",
                        "error-text": "#991b1b",
                        "tertiary-fixed-dim": "#cac6c4",
                        "on-secondary-container": "#616363",
                        "on-primary-container": "#858383",
                        "surface-container-high": "#ebe7e6",
                        "surface-tint": "#5f5e5e",
                        "on-tertiary-fixed-variant": "#484645",
                        "secondary-container": "#dfe0e0",
                        "border-strong": "#d4d4d4",
                        "secondary-fixed": "#e2e2e2",
                        "on-secondary-fixed-variant": "#454747",
                        "surface-variant": "#e5e2e1",
                        "on-surface-variant": "#444748",
                        "on-primary-fixed": "#1c1b1b",
                        "on-surface": "#1c1b1b",
                        "secondary-fixed-dim": "#c6c6c7",
                        "on-background": "#1c1b1b",
                        "inverse-primary": "#c8c6c5",
                        "primary-fixed-dim": "#c8c6c5",
                        "error": "#ba1a1a",
                        "tertiary": "#000000",
                        "on-primary-fixed-variant": "#474746",
                        "on-primary": "#ffffff",
                        "on-error-container": "#93000a",
                        "log-text": "#e5e5e5",
                        "success-bg": "#f0fdf4",
                        "primary-fixed": "#e5e2e1",
                        "warning-bg": "#fffbeb",
                        "outline": "#747878",
                        "secondary": "#5d5f5f",
                        "on-tertiary-container": "#868382",
                        "error-bg": "#fef2f2",
                        "outline-variant": "#c4c7c7",
                        "on-tertiary": "#ffffff",
                        "inverse-on-surface": "#f4f0ef",
                        "text-muted": "#737373",
                        "border": "#e5e5e5",
                        "text-secondary": "#525252",
                        "text-primary": "#171717",
                        "on-tertiary-fixed": "#1c1b1a",
                        "tertiary-fixed": "#e6e2df",
                        "inverse-surface": "#313030",
                        "surface-dim": "#ddd9d8",
                        "warning-text": "#92400e",
                        "background": "#fafafa",
                        "surface-muted": "#f5f5f5",
                        "surface-bright": "#fdf8f8",
                        "surface": "#fdf8f8",
                        "success-text": "#166534",
                        "on-error": "#ffffff",
                        "surface-container-lowest": "#ffffff",
                        "error-container": "#ffdad6",
                        "surface-container-highest": "#e5e2e1",
                        "on-secondary": "#ffffff"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "gap-lg": "24px",
                        "page-padding": "32px",
                        "gap-md": "16px",
                        "max-content-width": "1080px",
                        "sidebar-width": "220px"
                    },
                    "fontFamily": {
                        "code-sm": ["JetBrains Mono"],
                        "body-md": ["Inter"],
                        "label-sm": ["Inter"],
                        "headline-lg": ["Inter"],
                        "headline-md": ["Inter"]
                    },
                    "fontSize": {
                        "code-sm": ["12px", { "lineHeight": "18px", "fontWeight": "400" }],
                        "body-md": ["14px", { "lineHeight": "22px", "fontWeight": "400" }],
                        "label-sm": ["12px", { "lineHeight": "18px", "fontWeight": "400" }],
                        "headline-lg": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                        "headline-md": ["16px", { "lineHeight": "24px", "fontWeight": "600" }]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-background text-text-primary font-body-md text-body-md min-h-screen flex">
<!-- SideNavBar -->
<nav class="fixed left-0 top-0 bottom-0 flex flex-col w-[220px] h-screen border-r border-border dark:border-outline bg-background dark:bg-background z-40 hidden md:flex">
<!-- Header -->
<div class="p-gap-md flex items-center space-x-3 border-b border-border">
<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
<span class="font-headline-md text-headline-md">D</span>
</div>
<div>
<h1 class="font-headline-md text-headline-md text-primary dark:text-on-background">DocLab</h1>
<p class="font-label-sm text-label-sm text-text-muted">Healthcare ML</p>
</div>
</div>
<!-- CTA -->
<div class="p-gap-md">
<button class="w-full flex items-center justify-center space-x-2 bg-primary text-on-primary rounded-lg py-2 hover:bg-surface-container hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95">
<span class="material-symbols-outlined" style="font-size: 18px;">add</span>
<span class="font-label-sm text-label-sm font-semibold">New Prototype</span>
</button>
</div>
<!-- Main Nav -->
<div class="flex-1 overflow-y-auto py-2">
<a class="flex items-center space-x-3 px-gap-md py-3 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95" href="#">
<span class="material-symbols-outlined" data-icon="science">science</span>
<span>Experiments</span>
</a>
<a class="flex items-center space-x-3 px-gap-md py-3 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95" href="#">
<span class="material-symbols-outlined" data-icon="database">database</span>
<span>Datasets</span>
</a>
<a class="flex items-center space-x-3 px-gap-md py-3 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95" href="#">
<span class="material-symbols-outlined" data-icon="model_training">model_training</span>
<span>Models</span>
</a>
<a class="flex items-center space-x-3 px-gap-md py-3 text-primary dark:text-on-background font-bold border-r-2 border-primary hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
</div>
<!-- Footer Nav -->
<div class="border-t border-border py-2">
<a class="flex items-center space-x-3 px-gap-md py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 font-label-sm text-label-sm" href="#">
<span class="material-symbols-outlined" data-icon="description" style="font-size: 18px;">description</span>
<span>Documentation</span>
</a>
<a class="flex items-center space-x-3 px-gap-md py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 font-label-sm text-label-sm" href="#">
<span class="material-symbols-outlined" data-icon="help" style="font-size: 18px;">help</span>
<span>Support</span>
</a>
</div>
</nav>
<!-- Main Content Area -->
<div class="flex-1 md:ml-[220px] flex flex-col min-h-screen max-w-full">
<!-- TopAppBar -->
<header class="sticky top-0 z-50 flex justify-between items-center px-page-padding h-16 w-full border-b border-border dark:border-outline bg-surface dark:bg-surface">
<div class="flex items-center space-x-4">
<button class="md:hidden text-text-secondary hover:text-primary transition-colors duration-200">
<span class="material-symbols-outlined">menu</span>
</button>
<h2 class="font-headline-lg text-headline-lg text-primary dark:text-on-surface">Settings</h2>
</div>
<div class="flex items-center space-x-4">
<button class="text-text-secondary dark:text-text-disabled hover:text-primary dark:hover:text-on-surface transition-colors duration-200 ease-in-out">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button class="text-text-secondary dark:text-text-disabled hover:text-primary dark:hover:text-on-surface transition-colors duration-200 ease-in-out">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
<button class="hidden sm:flex px-4 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:bg-tertiary-container transition-colors">
                    Deploy Model
                </button>
</div>
</header>
<!-- Main Content -->
<main class="flex-1 p-page-padding max-w-max-content-width w-full mx-auto space-y-gap-lg">
<!-- Workspace Settings -->
<section class="bg-surface-container-lowest border border-border rounded-xl p-6">
<h3 class="font-headline-md text-headline-md text-primary mb-4 flex items-center space-x-2">
<span class="material-symbols-outlined text-text-muted">domain</span>
<span>Workspace</span>
</h3>
<div class="space-y-4">
<div class="flex items-center space-x-4 mb-6">
<div class="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center border border-border overflow-hidden">
<span class="material-symbols-outlined text-text-disabled" style="font-size: 32px;">person</span>
</div>
<button class="px-4 py-2 border border-border-strong rounded-lg text-text-primary hover:bg-surface-muted transition-colors font-label-sm text-label-sm">
                            Change Avatar
                        </button>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-2">
<label class="block font-label-sm text-label-sm text-text-secondary">Workspace Name</label>
<input class="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-border-strong text-text-primary" type="text" value="DocLab ML Env"/>
</div>
<div class="space-y-2">
<label class="block font-label-sm text-label-sm text-text-secondary">Healthcare Institution</label>
<input class="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-border-strong text-text-primary" type="text" value="St. Jude Research"/>
</div>
</div>
</div>
</section>
<!-- Agent Configuration -->
<section class="bg-surface-container-lowest border border-border rounded-xl p-6">
<h3 class="font-headline-md text-headline-md text-primary mb-4 flex items-center space-x-2">
<span class="material-symbols-outlined text-text-muted">smart_toy</span>
<span>Agent Configuration</span>
</h3>
<div class="space-y-6">
<div class="space-y-2">
<label class="block font-label-sm text-label-sm text-text-secondary">Default Planning Model</label>
<select class="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-border-strong text-text-primary appearance-none">
<option>GPT-4 (Clinical Fine-tune)</option>
<option>Claude 3 Opus (Medical)</option>
<option>Llama 3 70B (Base)</option>
</select>
</div>
<div class="space-y-2">
<label class="block font-label-sm text-label-sm text-text-secondary">Preferred Datasets</label>
<div class="flex flex-wrap gap-2">
<span class="inline-flex items-center px-3 py-1 bg-surface-muted border border-border rounded-full font-label-sm text-label-sm text-text-secondary">
                                MIMIC-IV
                                <button class="ml-2 hover:text-error-text transition-colors"><span class="material-symbols-outlined" style="font-size: 14px;">close</span></button>
</span>
<span class="inline-flex items-center px-3 py-1 bg-surface-muted border border-border rounded-full font-label-sm text-label-sm text-text-secondary">
                                PubMed Central
                                <button class="ml-2 hover:text-error-text transition-colors"><span class="material-symbols-outlined" style="font-size: 14px;">close</span></button>
</span>
<button class="inline-flex items-center px-3 py-1 border border-dashed border-border-strong rounded-full font-label-sm text-label-sm text-text-muted hover:bg-surface-muted transition-colors">
<span class="material-symbols-outlined mr-1" style="font-size: 14px;">add</span> Add Dataset
                            </button>
</div>
</div>
<div class="space-y-2">
<label class="block font-label-sm text-label-sm text-text-secondary">Log Verbosity</label>
<div class="flex items-center space-x-4">
<label class="flex items-center space-x-2 cursor-pointer">
<input class="text-primary focus:ring-primary border-border" name="verbosity" type="radio"/>
<span class="text-text-primary">Minimal</span>
</label>
<label class="flex items-center space-x-2 cursor-pointer">
<input checked="" class="text-primary focus:ring-primary border-border" name="verbosity" type="radio"/>
<span class="text-text-primary">Standard</span>
</label>
<label class="flex items-center space-x-2 cursor-pointer">
<input class="text-primary focus:ring-primary border-border" name="verbosity" type="radio"/>
<span class="text-text-primary">Debug (Verbose)</span>
</label>
</div>
</div>
</div>
</section>
<!-- API & Integration -->
<section class="bg-surface-container-lowest border border-border rounded-xl p-6">
<h3 class="font-headline-md text-headline-md text-primary mb-4 flex items-center space-x-2">
<span class="material-symbols-outlined text-text-muted">api</span>
<span>API &amp; Integration</span>
</h3>
<div class="space-y-4">
<div class="space-y-2">
<label class="block font-label-sm text-label-sm text-text-secondary">Hugging Face Token</label>
<div class="flex space-x-2">
<input class="flex-1 bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-border-strong text-text-primary font-code-sm text-code-sm" type="password" value="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"/>
<button class="px-4 py-2 border border-border-strong rounded-lg text-text-primary hover:bg-surface-muted transition-colors">
<span class="material-symbols-outlined" style="font-size: 18px;">visibility</span>
</button>
</div>
</div>
<div class="space-y-2">
<label class="block font-label-sm text-label-sm text-text-secondary">Internal Clinical Registry Endpoint</label>
<input class="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-border-strong text-text-primary font-code-sm text-code-sm" type="url" value="https://api.stjude.internal/registry/v2"/>
</div>
</div>
</section>
<!-- Security -->
<section class="bg-surface-container-lowest border border-border rounded-xl p-6 mb-8">
<h3 class="font-headline-md text-headline-md text-primary mb-4 flex items-center space-x-2">
<span class="material-symbols-outlined text-text-muted">security</span>
<span>Security &amp; Access</span>
</h3>
<div class="space-y-4">
<div class="space-y-2">
<label class="block font-label-sm text-label-sm text-text-secondary">Your Role</label>
<div class="p-3 bg-surface-muted border border-border rounded-lg flex items-center justify-between">
<div class="flex items-center space-x-2">
<span class="material-symbols-outlined text-primary">admin_panel_settings</span>
<span class="font-semibold text-text-primary">Administrator</span>
</div>
<span class="px-2 py-1 bg-success-bg text-success-text text-[10px] rounded-full uppercase tracking-wider font-semibold border border-success-text/20">Active</span>
</div>
<p class="text-[12px] text-text-muted mt-1">You have full access to workspace settings, dataset imports, and model deployment.</p>
</div>
</div>
</section>
<!-- Action Area -->
<div class="flex justify-end space-x-4 border-t border-border pt-6 pb-12">
<button class="px-6 py-2 border border-border-strong rounded-lg text-text-primary hover:bg-surface-muted transition-colors font-label-sm text-label-sm">
                    Discard Changes
                </button>
<button class="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:bg-tertiary-container transition-colors">
                    Save Settings
                </button>
</div>
</main>
</div>
</body></html>

<!-- DocLab: Experiments History -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>DocLab - Experiments</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&amp;family=JetBrains+Mono:wght@400&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined.fill {
            font-variation-settings: 'FILL' 1;
        }
    </style>
<!-- Tailwind Config -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "log-bg": "#0a0a0a",
                        "surface-container": "#f1edec",
                        "tertiary-container": "#1c1b1a",
                        "on-secondary-fixed": "#1a1c1c",
                        "primary-container": "#1c1b1b",
                        "text-disabled": "#a3a3a3",
                        "primary": "#000000",
                        "surface-container-low": "#f7f3f2",
                        "error-text": "#991b1b",
                        "tertiary-fixed-dim": "#cac6c4",
                        "on-secondary-container": "#616363",
                        "on-primary-container": "#858383",
                        "surface-container-high": "#ebe7e6",
                        "surface-tint": "#5f5e5e",
                        "on-tertiary-fixed-variant": "#484645",
                        "secondary-container": "#dfe0e0",
                        "border-strong": "#d4d4d4",
                        "secondary-fixed": "#e2e2e2",
                        "on-secondary-fixed-variant": "#454747",
                        "surface-variant": "#e5e2e1",
                        "on-surface-variant": "#444748",
                        "on-primary-fixed": "#1c1b1b",
                        "on-surface": "#1c1b1b",
                        "secondary-fixed-dim": "#c6c6c7",
                        "on-background": "#1c1b1b",
                        "inverse-primary": "#c8c6c5",
                        "primary-fixed-dim": "#c8c6c5",
                        "error": "#ba1a1a",
                        "tertiary": "#000000",
                        "on-primary-fixed-variant": "#474746",
                        "on-primary": "#ffffff",
                        "on-error-container": "#93000a",
                        "log-text": "#e5e5e5",
                        "success-bg": "#f0fdf4",
                        "primary-fixed": "#e5e2e1",
                        "warning-bg": "#fffbeb",
                        "outline": "#747878",
                        "secondary": "#5d5f5f",
                        "on-tertiary-container": "#868382",
                        "error-bg": "#fef2f2",
                        "outline-variant": "#c4c7c7",
                        "on-tertiary": "#ffffff",
                        "inverse-on-surface": "#f4f0ef",
                        "text-muted": "#737373",
                        "border": "#e5e5e5",
                        "text-secondary": "#525252",
                        "text-primary": "#171717",
                        "on-tertiary-fixed": "#1c1b1a",
                        "tertiary-fixed": "#e6e2df",
                        "inverse-surface": "#313030",
                        "surface-dim": "#ddd9d8",
                        "warning-text": "#92400e",
                        "background": "#fafafa",
                        "surface-muted": "#f5f5f5",
                        "surface-bright": "#fdf8f8",
                        "surface": "#fdf8f8",
                        "success-text": "#166534",
                        "on-error": "#ffffff",
                        "surface-container-lowest": "#ffffff",
                        "error-container": "#ffdad6",
                        "surface-container-highest": "#e5e2e1",
                        "on-secondary": "#ffffff"
                    },
                    borderRadius: {
                        DEFAULT: "0.25rem",
                        lg: "0.5rem",
                        xl: "0.75rem",
                        full: "9999px"
                    },
                    spacing: {
                        "gap-lg": "24px",
                        "page-padding": "32px",
                        "gap-md": "16px",
                        "max-content-width": "1080px",
                        "sidebar-width": "220px"
                    },
                    fontFamily: {
                        "code-sm": ["JetBrains Mono"],
                        "body-md": ["Inter"],
                        "label-sm": ["Inter"],
                        "headline-lg": ["Inter"],
                        "headline-md": ["Inter"]
                    },
                    fontSize: {
                        "code-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
                        "body-md": ["14px", { lineHeight: "22px", fontWeight: "400" }],
                        "label-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
                        "headline-lg": ["24px", { lineHeight: "32px", fontWeight: "600" }],
                        "headline-md": ["16px", { lineHeight: "24px", fontWeight: "600" }]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-background text-text-primary font-body-md text-body-md antialiased overflow-hidden flex h-screen">
<!-- SideNavBar Component -->
<nav class="fixed left-0 top-0 bottom-0 flex flex-col w-[220px] h-screen border-r border-border dark:border-outline bg-background dark:bg-background z-40">
<!-- Header -->
<div class="p-gap-md mb-2 flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
<span class="material-symbols-outlined text-[18px]">biotech</span>
</div>
<div>
<h1 class="font-headline-md text-headline-md text-primary dark:text-on-background m-0">DocLab</h1>
<p class="font-label-sm text-label-sm text-text-muted m-0">Healthcare ML</p>
</div>
</div>
<!-- CTA -->
<div class="px-gap-md mb-6">
<button class="w-full h-10 bg-primary text-on-primary rounded font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-tertiary-container transition-colors active:scale-95 duration-200">
<span class="material-symbols-outlined text-[18px]">add</span>
                New Prototype
            </button>
</div>
<!-- Primary Navigation Tabs -->
<div class="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
<!-- Inactive -->
<a class="flex items-center gap-3 px-3 py-2 rounded text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 duration-200" href="#">
<span class="material-symbols-outlined text-[20px]">add_box</span>
<span>New Prototype</span>
</a>
<!-- Active State Logic Applied -->
<a class="flex items-center gap-3 px-3 py-2 rounded text-primary dark:text-on-background font-bold border-r-2 border-primary bg-surface-container-low transition-colors cursor-pointer active:scale-95 duration-200" href="#">
<span class="material-symbols-outlined text-[20px] fill">science</span>
<span>Experiments</span>
</a>
<!-- Inactive -->
<a class="flex items-center gap-3 px-3 py-2 rounded text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 duration-200" href="#">
<span class="material-symbols-outlined text-[20px]">database</span>
<span>Datasets</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 duration-200" href="#">
<span class="material-symbols-outlined text-[20px]">model_training</span>
<span>Models</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 duration-200" href="#">
<span class="material-symbols-outlined text-[20px]">settings</span>
<span>Settings</span>
</a>
</div>
<!-- Footer Tabs -->
<div class="mt-auto flex flex-col gap-1 px-3 py-4 border-t border-border">
<a class="flex items-center gap-3 px-3 py-2 rounded text-text-muted hover:bg-surface-container transition-colors cursor-pointer" href="#">
<span class="material-symbols-outlined text-[20px]">description</span>
<span>Documentation</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded text-text-muted hover:bg-surface-container transition-colors cursor-pointer" href="#">
<span class="material-symbols-outlined text-[20px]">help</span>
<span>Support</span>
</a>
</div>
</nav>
<!-- Main Workspace Area -->
<div class="ml-[220px] flex-1 flex flex-col h-screen overflow-hidden bg-background relative w-full">
<!-- TopAppBar Component -->
<header class="sticky top-0 z-50 flex justify-between items-center px-page-padding h-16 w-full bg-surface dark:bg-surface border-b border-border dark:border-outline duration-200 ease-in-out shrink-0">
<!-- Left: Search Bar -->
<div class="flex-1 max-w-md">
<div class="relative flex items-center w-full h-9 rounded border border-border bg-surface-container-lowest overflow-hidden focus-within:border-border-strong transition-colors">
<span class="material-symbols-outlined text-text-muted pl-3 text-[18px]">search</span>
<input class="w-full h-full bg-transparent border-none focus:ring-0 text-body-md font-body-md px-2 text-text-primary placeholder:text-text-disabled" placeholder="Search experiments, datasets..." type="text"/>
</div>
</div>
<!-- Right: Actions -->
<div class="flex items-center gap-4">
<button class="h-9 px-4 bg-primary text-on-primary rounded font-label-sm text-label-sm flex items-center justify-center hover:bg-tertiary-container transition-colors">
                    Deploy Model
                </button>
<div class="w-px h-6 bg-border mx-1"></div>
<button class="text-text-secondary hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container">
<span class="material-symbols-outlined text-[20px]">notifications</span>
</button>
<button class="text-text-secondary hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container">
<span class="material-symbols-outlined text-[20px]">account_circle</span>
</button>
</div>
</header>
<!-- Page Canvas -->
<main class="flex-1 overflow-y-auto px-page-padding py-page-padding">
<div class="max-w-max-content-width mx-auto">
<!-- Page Header -->
<div class="flex items-center justify-between mb-gap-lg">
<h1 class="font-headline-lg text-headline-lg text-text-primary m-0">Experiments</h1>
<button class="flex items-center gap-2 h-9 px-3 bg-surface-container-lowest border border-border text-text-primary rounded font-label-sm text-label-sm hover:bg-surface-muted transition-colors">
<span class="material-symbols-outlined text-[16px]">filter_list</span>
                        Filter
                    </button>
</div>
<!-- Technical Table Container -->
<div class="w-full bg-surface-container-lowest border border-border rounded-lg overflow-hidden flex flex-col">
<div class="overflow-x-auto w-full">
<table class="w-full text-left border-collapse">
<thead>
<tr class="border-b border-border bg-background">
<th class="py-3 px-4 font-label-sm text-label-sm text-text-muted font-normal whitespace-nowrap">Experiment ID</th>
<th class="py-3 px-4 font-label-sm text-label-sm text-text-muted font-normal">Goal</th>
<th class="py-3 px-4 font-label-sm text-label-sm text-text-muted font-normal">Dataset</th>
<th class="py-3 px-4 font-label-sm text-label-sm text-text-muted font-normal">Model</th>
<th class="py-3 px-4 font-label-sm text-label-sm text-text-muted font-normal">Metric</th>
<th class="py-3 px-4 font-label-sm text-label-sm text-text-muted font-normal">Status</th>
<th class="py-3 px-4 font-label-sm text-label-sm text-text-muted font-normal text-right">Date</th>
</tr>
</thead>
<tbody class="font-body-md text-body-md text-text-primary divide-y divide-border">
<!-- Row 1 -->
<tr class="hover:bg-surface-muted transition-colors group">
<td class="py-3 px-4 whitespace-nowrap">
<span class="font-code-sm text-code-sm text-text-secondary bg-surface-container px-2 py-1 rounded">EXP-0042</span>
</td>
<td class="py-3 px-4 max-w-[200px] truncate" title="Predict readmission risk">Predict readmission risk</td>
<td class="py-3 px-4 text-text-secondary">MIMIC-IV Clinical</td>
<td class="py-3 px-4 text-text-secondary">XGBoost</td>
<td class="py-3 px-4">83% Accuracy</td>
<td class="py-3 px-4">
<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-success-bg text-success-text border border-[#bbf7d0]">
                                            Complete
                                        </span>
</td>
<td class="py-3 px-4 text-right text-text-muted whitespace-nowrap">Today</td>
</tr>
<!-- Row 2 -->
<tr class="hover:bg-surface-muted transition-colors group">
<td class="py-3 px-4 whitespace-nowrap">
<span class="font-code-sm text-code-sm text-text-secondary bg-surface-container px-2 py-1 rounded">EXP-0041</span>
</td>
<td class="py-3 px-4 max-w-[200px] truncate" title="Sepsis onset detection">Sepsis onset detection</td>
<td class="py-3 px-4 text-text-secondary">ICU Vital Signs</td>
<td class="py-3 px-4 text-text-secondary">LSTM</td>
<td class="py-3 px-4">0.78 AUC</td>
<td class="py-3 px-4">
<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-surface-container text-text-secondary border border-border">
<span class="w-1.5 h-1.5 rounded-full bg-outline mr-1.5 animate-pulse"></span>
                                            Running
                                        </span>
</td>
<td class="py-3 px-4 text-right text-text-muted whitespace-nowrap">Oct 24, 2023</td>
</tr>
<!-- Row 3 -->
<tr class="hover:bg-surface-muted transition-colors group">
<td class="py-3 px-4 whitespace-nowrap">
<span class="font-code-sm text-code-sm text-text-secondary bg-surface-container px-2 py-1 rounded">EXP-0040</span>
</td>
<td class="py-3 px-4 max-w-[200px] truncate" title="Patient length of stay">Patient length of stay</td>
<td class="py-3 px-4 text-text-secondary">Historical Admissions</td>
<td class="py-3 px-4 text-text-secondary">Random Forest</td>
<td class="py-3 px-4 text-text-muted">—</td>
<td class="py-3 px-4">
<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-error-bg text-error-text border border-[#fecaca]">
                                            Failed
                                        </span>
</td>
<td class="py-3 px-4 text-right text-text-muted whitespace-nowrap">Oct 22, 2023</td>
</tr>
<!-- Row 4 -->
<tr class="hover:bg-surface-muted transition-colors group">
<td class="py-3 px-4 whitespace-nowrap">
<span class="font-code-sm text-code-sm text-text-secondary bg-surface-container px-2 py-1 rounded">EXP-0039</span>
</td>
<td class="py-3 px-4 max-w-[200px] truncate" title="Chest X-ray anomaly">Chest X-ray anomaly</td>
<td class="py-3 px-4 text-text-secondary">PadChest</td>
<td class="py-3 px-4 text-text-secondary">ResNet-50</td>
<td class="py-3 px-4">91% Specificity</td>
<td class="py-3 px-4">
<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-success-bg text-success-text border border-[#bbf7d0]">
                                            Complete
                                        </span>
</td>
<td class="py-3 px-4 text-right text-text-muted whitespace-nowrap">Oct 20, 2023</td>
</tr>
<!-- Row 5 -->
<tr class="hover:bg-surface-muted transition-colors group">
<td class="py-3 px-4 whitespace-nowrap">
<span class="font-code-sm text-code-sm text-text-secondary bg-surface-container px-2 py-1 rounded">EXP-0038</span>
</td>
<td class="py-3 px-4 max-w-[200px] truncate" title="Medication dosage optimization">Medication dosage optimization</td>
<td class="py-3 px-4 text-text-secondary">EHR Pharma Records</td>
<td class="py-3 px-4 text-text-secondary">Transformer</td>
<td class="py-3 px-4">1.2 RMSE</td>
<td class="py-3 px-4">
<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-success-bg text-success-text border border-[#bbf7d0]">
                                            Complete
                                        </span>
</td>
<td class="py-3 px-4 text-right text-text-muted whitespace-nowrap">Oct 18, 2023</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Pagination/Footer -->
<div class="px-4 py-3 border-t border-border bg-background flex items-center justify-between">
<span class="font-label-sm text-label-sm text-text-muted">Showing 1 to 5 of 42 entries</span>
<div class="flex gap-1">
<button class="w-8 h-8 flex items-center justify-center rounded border border-border text-text-disabled cursor-not-allowed">
<span class="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button class="w-8 h-8 flex items-center justify-center rounded border border-border text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</main>
</div>
</body></html>

<!-- DocLab: Model Registry -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Models - DocLab</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&amp;family=JetBrains+Mono:wght@400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "log-bg": "#0a0a0a",
                      "surface-container": "#f1edec",
                      "tertiary-container": "#1c1b1a",
                      "on-secondary-fixed": "#1a1c1c",
                      "primary-container": "#1c1b1b",
                      "text-disabled": "#a3a3a3",
                      "primary": "#000000",
                      "surface-container-low": "#f7f3f2",
                      "error-text": "#991b1b",
                      "tertiary-fixed-dim": "#cac6c4",
                      "on-secondary-container": "#616363",
                      "on-primary-container": "#858383",
                      "surface-container-high": "#ebe7e6",
                      "surface-tint": "#5f5e5e",
                      "on-tertiary-fixed-variant": "#484645",
                      "secondary-container": "#dfe0e0",
                      "border-strong": "#d4d4d4",
                      "secondary-fixed": "#e2e2e2",
                      "on-secondary-fixed-variant": "#454747",
                      "surface-variant": "#e5e2e1",
                      "on-surface-variant": "#444748",
                      "on-primary-fixed": "#1c1b1b",
                      "on-surface": "#1c1b1b",
                      "secondary-fixed-dim": "#c6c6c7",
                      "on-background": "#1c1b1b",
                      "inverse-primary": "#c8c6c5",
                      "primary-fixed-dim": "#c8c6c5",
                      "error": "#ba1a1a",
                      "tertiary": "#000000",
                      "on-primary-fixed-variant": "#474746",
                      "on-primary": "#ffffff",
                      "on-error-container": "#93000a",
                      "log-text": "#e5e5e5",
                      "success-bg": "#f0fdf4",
                      "primary-fixed": "#e5e2e1",
                      "warning-bg": "#fffbeb",
                      "outline": "#747878",
                      "secondary": "#5d5f5f",
                      "on-tertiary-container": "#868382",
                      "error-bg": "#fef2f2",
                      "outline-variant": "#c4c7c7",
                      "on-tertiary": "#ffffff",
                      "inverse-on-surface": "#f4f0ef",
                      "text-muted": "#737373",
                      "border": "#e5e5e5",
                      "text-secondary": "#525252",
                      "text-primary": "#171717",
                      "on-tertiary-fixed": "#1c1b1a",
                      "tertiary-fixed": "#e6e2df",
                      "inverse-surface": "#313030",
                      "surface-dim": "#ddd9d8",
                      "warning-text": "#92400e",
                      "background": "#fafafa",
                      "surface-muted": "#f5f5f5",
                      "surface-bright": "#fdf8f8",
                      "surface": "#fdf8f8",
                      "success-text": "#166534",
                      "on-error": "#ffffff",
                      "surface-container-lowest": "#ffffff",
                      "error-container": "#ffdad6",
                      "surface-container-highest": "#e5e2e1",
                      "on-secondary": "#ffffff"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "gap-lg": "24px",
                      "page-padding": "32px",
                      "gap-md": "16px",
                      "max-content-width": "1080px",
                      "sidebar-width": "220px"
              },
              "fontFamily": {
                      "code-sm": [
                              "JetBrains Mono"
                      ],
                      "body-md": [
                              "Inter"
                      ],
                      "label-sm": [
                              "Inter"
                      ],
                      "headline-lg": [
                              "Inter"
                      ],
                      "headline-md": [
                              "Inter"
                      ]
              },
              "fontSize": {
                      "code-sm": [
                              "12px",
                              {
                                      "lineHeight": "18px",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-md": [
                              "14px",
                              {
                                      "lineHeight": "22px",
                                      "fontWeight": "400"
                              }
                      ],
                      "label-sm": [
                              "12px",
                              {
                                      "lineHeight": "18px",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg": [
                              "24px",
                              {
                                      "lineHeight": "32px",
                                      "fontWeight": "600"
                              }
                      ],
                      "headline-md": [
                              "16px",
                              {
                                      "lineHeight": "24px",
                                      "fontWeight": "600"
                              }
                      ]
              }
      },
          },
        }
      </script>
</head>
<body class="bg-background text-text-primary font-body-md antialiased h-screen flex overflow-hidden">
<!-- SideNavBar -->
<nav class="fixed left-0 top-0 bottom-0 flex flex-col w-[220px] h-screen border-r border-border dark:border-outline bg-background dark:bg-background z-40">
<div class="p-6">
<div class="flex items-center gap-3 mb-8">
<div class="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold">D</div>
<div>
<h1 class="font-headline-md text-headline-md text-primary dark:text-on-background">DocLab</h1>
<p class="font-label-sm text-label-sm text-text-muted">Healthcare ML</p>
</div>
</div>
<button class="w-full bg-primary text-on-primary hover:bg-tertiary-container transition-colors py-2 px-4 rounded-lg font-body-md text-body-md flex items-center justify-center gap-2 mb-8 cursor-pointer active:scale-95 transition-transform">
<span class="material-symbols-outlined text-[18px]">add</span>
                New Prototype
            </button>
<ul class="space-y-1">
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined text-[20px]">add_box</span>
<span class="font-body-md text-body-md">New Prototype</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined text-[20px]">science</span>
<span class="font-body-md text-body-md">Experiments</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined text-[20px]">database</span>
<span class="font-body-md text-body-md">Datasets</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-primary dark:text-on-background font-bold border-r-2 border-primary bg-surface-container hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">model_training</span>
<span class="font-body-md text-body-md">Models</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined text-[20px]">settings</span>
<span class="font-body-md text-body-md">Settings</span>
</a>
</li>
</ul>
</div>
<div class="mt-auto p-6 border-t border-border dark:border-outline">
<ul class="space-y-1">
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined text-[20px]">description</span>
<span class="font-body-md text-body-md">Documentation</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined text-[20px]">help</span>
<span class="font-body-md text-body-md">Support</span>
</a>
</li>
</ul>
</div>
</nav>
<!-- Main Content Area -->
<div class="flex-1 ml-[220px] flex flex-col h-screen overflow-hidden">
<!-- TopAppBar -->
<header class="sticky top-0 z-50 flex justify-between items-center px-page-padding h-16 w-full bg-surface dark:bg-surface border-b border-border dark:border-outline flat no shadows">
<div class="flex items-center gap-4">
<h2 class="font-headline-lg text-headline-lg text-primary dark:text-on-surface">Models</h2>
</div>
<div class="flex items-center gap-4">
<button class="text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out">
<span class="material-symbols-outlined">account_circle</span>
</button>
<button class="bg-primary text-on-primary hover:bg-tertiary-container transition-colors py-1.5 px-4 rounded-lg font-body-md text-body-md duration-200 ease-in-out">
                    Deploy Model
                </button>
</div>
</header>
<!-- Scrollable Content -->
<main class="flex-1 overflow-y-auto p-page-padding bg-background">
<div class="max-w-max-content-width mx-auto space-y-8">
<!-- Trained Models Section -->
<section>
<div class="flex justify-between items-center mb-4">
<h3 class="font-headline-md text-headline-md text-text-primary">Trained Models</h3>
<div class="relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">search</span>
<input class="pl-9 pr-4 py-1.5 border border-border rounded-lg text-body-md font-body-md bg-surface w-64 focus:outline-none focus:border-outline-variant transition-colors" placeholder="Search models..." type="text"/>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap-md">
<!-- Model Card 1 -->
<div class="bg-surface border border-border rounded-xl p-5 flex flex-col hover:border-outline-variant transition-colors">
<div class="flex justify-between items-start mb-3">
<div>
<h4 class="font-headline-md text-headline-md text-primary">CardioPredict-v2</h4>
<p class="font-label-sm text-label-sm text-text-muted mt-0.5">Classification • v2.1.0</p>
</div>
<span class="bg-success-bg text-success-text px-2 py-0.5 rounded text-[11px] font-semibold border border-success-text/20">Production</span>
</div>
<div class="font-body-md text-body-md text-text-secondary mb-4 flex-1">
                                High-accuracy classifier for early detection of cardiovascular anomalies from multi-lead ECG data.
                            </div>
<div class="flex items-center gap-4 mt-auto pt-4 border-t border-border">
<div class="flex-1">
<div class="font-label-sm text-label-sm text-text-muted mb-1">F1 Score</div>
<div class="font-code-sm text-code-sm text-primary">0.942</div>
</div>
<a class="text-primary font-body-md text-body-md hover:underline flex items-center gap-1" href="#">
                                    View Card <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
<!-- Model Card 2 -->
<div class="bg-surface border border-border rounded-xl p-5 flex flex-col hover:border-outline-variant transition-colors">
<div class="flex justify-between items-start mb-3">
<div>
<h4 class="font-headline-md text-headline-md text-primary">PulmoScan-ResNet</h4>
<p class="font-label-sm text-label-sm text-text-muted mt-0.5">Segmentation • v1.4.2</p>
</div>
<span class="bg-warning-bg text-warning-text px-2 py-0.5 rounded text-[11px] font-semibold border border-warning-text/20">Staging</span>
</div>
<div class="font-body-md text-body-md text-text-secondary mb-4 flex-1">
                                CXR segmentation model optimized for identifying nodular opacities with low false-positive rates.
                            </div>
<div class="flex items-center gap-4 mt-auto pt-4 border-t border-border">
<div class="flex-1">
<div class="font-label-sm text-label-sm text-text-muted mb-1">Dice Coeff</div>
<div class="font-code-sm text-code-sm text-primary">0.887</div>
</div>
<a class="text-primary font-body-md text-body-md hover:underline flex items-center gap-1" href="#">
                                    View Card <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
<!-- Model Card 3 -->
<div class="bg-surface border border-border rounded-xl p-5 flex flex-col hover:border-outline-variant transition-colors opacity-75">
<div class="flex justify-between items-start mb-3">
<div>
<h4 class="font-headline-md text-headline-md text-text-secondary">ClinicalBERT-Notes</h4>
<p class="font-label-sm text-label-sm text-text-muted mt-0.5">NER • v1.0.0</p>
</div>
<span class="bg-surface-muted text-text-secondary px-2 py-0.5 rounded text-[11px] font-semibold border border-border">Archive</span>
</div>
<div class="font-body-md text-body-md text-text-secondary mb-4 flex-1">
                                Legacy entity extraction model for unstructured clinical notes. Deprecated in favor of v2.
                            </div>
<div class="flex items-center gap-4 mt-auto pt-4 border-t border-border">
<div class="flex-1">
<div class="font-label-sm text-label-sm text-text-muted mb-1">Accuracy</div>
<div class="font-code-sm text-code-sm text-text-secondary">0.910</div>
</div>
<a class="text-text-secondary font-body-md text-body-md hover:underline flex items-center gap-1" href="#">
                                    View Card <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
</div>
</section>
<!-- Base Architectures Section -->
<section>
<h3 class="font-headline-md text-headline-md text-text-primary mb-4">Base Architectures</h3>
<div class="bg-surface border border-border rounded-xl overflow-hidden">
<table class="w-full text-left border-collapse">
<thead>
<tr class="border-b border-border bg-surface-muted">
<th class="py-3 px-5 font-label-sm text-label-sm text-text-muted font-medium w-1/3">Architecture</th>
<th class="py-3 px-5 font-label-sm text-label-sm text-text-muted font-medium w-1/3">Primary Task</th>
<th class="py-3 px-5 font-label-sm text-label-sm text-text-muted font-medium w-1/3">Availability</th>
</tr>
</thead>
<tbody class="font-body-md text-body-md text-text-primary divide-y divide-border">
<tr class="hover:bg-surface-bright transition-colors">
<td class="py-3 px-5 font-code-sm text-code-sm">XGBoost</td>
<td class="py-3 px-5 text-text-secondary">Tabular Classification / Regression</td>
<td class="py-3 px-5"><span class="flex items-center gap-1.5 text-success-text text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-success-text"></span> Ready</span></td>
</tr>
<tr class="hover:bg-surface-bright transition-colors">
<td class="py-3 px-5 font-code-sm text-code-sm">ResNet-50</td>
<td class="py-3 px-5 text-text-secondary">Image Classification</td>
<td class="py-3 px-5"><span class="flex items-center gap-1.5 text-success-text text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-success-text"></span> Ready</span></td>
</tr>
<tr class="hover:bg-surface-bright transition-colors">
<td class="py-3 px-5 font-code-sm text-code-sm">U-Net</td>
<td class="py-3 px-5 text-text-secondary">Image Segmentation</td>
<td class="py-3 px-5"><span class="flex items-center gap-1.5 text-success-text text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-success-text"></span> Ready</span></td>
</tr>
<tr class="hover:bg-surface-bright transition-colors">
<td class="py-3 px-5 font-code-sm text-code-sm">BERT-base</td>
<td class="py-3 px-5 text-text-secondary">NLP / Text Classification</td>
<td class="py-3 px-5"><span class="flex items-center gap-1.5 text-success-text text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-success-text"></span> Ready</span></td>
</tr>
<tr class="hover:bg-surface-bright transition-colors">
<td class="py-3 px-5 font-code-sm text-code-sm">Llama-3-8B-Instruct</td>
<td class="py-3 px-5 text-text-secondary">Generative QA / Summarization</td>
<td class="py-3 px-5"><span class="flex items-center gap-1.5 text-warning-text text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-warning-text"></span> Requires GPU</span></td>
</tr>
</tbody>
</table>
</div>
</section>
</div>
</main>
</div>
</body></html>

<!-- DocLab: Datasets Inventory -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Datasets - DocLab</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "log-bg": "#0a0a0a",
                      "surface-container": "#f1edec",
                      "tertiary-container": "#1c1b1a",
                      "on-secondary-fixed": "#1a1c1c",
                      "primary-container": "#1c1b1b",
                      "text-disabled": "#a3a3a3",
                      "primary": "#000000",
                      "surface-container-low": "#f7f3f2",
                      "error-text": "#991b1b",
                      "tertiary-fixed-dim": "#cac6c4",
                      "on-secondary-container": "#616363",
                      "on-primary-container": "#858383",
                      "surface-container-high": "#ebe7e6",
                      "surface-tint": "#5f5e5e",
                      "on-tertiary-fixed-variant": "#484645",
                      "secondary-container": "#dfe0e0",
                      "border-strong": "#d4d4d4",
                      "secondary-fixed": "#e2e2e2",
                      "on-secondary-fixed-variant": "#454747",
                      "surface-variant": "#e5e2e1",
                      "on-surface-variant": "#444748",
                      "on-primary-fixed": "#1c1b1b",
                      "on-surface": "#1c1b1b",
                      "secondary-fixed-dim": "#c6c6c7",
                      "on-background": "#1c1b1b",
                      "inverse-primary": "#c8c6c5",
                      "primary-fixed-dim": "#c8c6c5",
                      "error": "#ba1a1a",
                      "tertiary": "#000000",
                      "on-primary-fixed-variant": "#474746",
                      "on-primary": "#ffffff",
                      "on-error-container": "#93000a",
                      "log-text": "#e5e5e5",
                      "success-bg": "#f0fdf4",
                      "primary-fixed": "#e5e2e1",
                      "warning-bg": "#fffbeb",
                      "outline": "#747878",
                      "secondary": "#5d5f5f",
                      "on-tertiary-container": "#868382",
                      "error-bg": "#fef2f2",
                      "outline-variant": "#c4c7c7",
                      "on-tertiary": "#ffffff",
                      "inverse-on-surface": "#f4f0ef",
                      "text-muted": "#737373",
                      "border": "#e5e5e5",
                      "text-secondary": "#525252",
                      "text-primary": "#171717",
                      "on-tertiary-fixed": "#1c1b1a",
                      "tertiary-fixed": "#e6e2df",
                      "inverse-surface": "#313030",
                      "surface-dim": "#ddd9d8",
                      "warning-text": "#92400e",
                      "background": "#fafafa",
                      "surface-muted": "#f5f5f5",
                      "surface-bright": "#fdf8f8",
                      "surface": "#fdf8f8",
                      "success-text": "#166534",
                      "on-error": "#ffffff",
                      "surface-container-lowest": "#ffffff",
                      "error-container": "#ffdad6",
                      "surface-container-highest": "#e5e2e1",
                      "on-secondary": "#ffffff"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "gap-lg": "24px",
                      "page-padding": "32px",
                      "gap-md": "16px",
                      "max-content-width": "1080px",
                      "sidebar-width": "220px"
              },
              "fontFamily": {
                      "code-sm": [
                              "JetBrains Mono"
                      ],
                      "body-md": [
                              "Inter"
                      ],
                      "label-sm": [
                              "Inter"
                      ],
                      "headline-lg": [
                              "Inter"
                      ],
                      "headline-md": [
                              "Inter"
                      ]
              },
              "fontSize": {
                      "code-sm": [
                              "12px",
                              {
                                      "lineHeight": "18px",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-md": [
                              "14px",
                              {
                                      "lineHeight": "22px",
                                      "fontWeight": "400"
                              }
                      ],
                      "label-sm": [
                              "12px",
                              {
                                      "lineHeight": "18px",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg": [
                              "24px",
                              {
                                      "lineHeight": "32px",
                                      "fontWeight": "600"
                              }
                      ],
                      "headline-md": [
                              "16px",
                              {
                                      "lineHeight": "24px",
                                      "fontWeight": "600"
                              }
                      ]
              }
      },
          },
        }
      </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      </style>
</head>
<body class="bg-background text-text-primary font-body-md min-h-screen flex selection:bg-surface-container-highest selection:text-text-primary">
<!-- SideNavBar (Shared Component) -->
<aside class="w-[220px] h-screen border-r border-border dark:border-outline bg-background dark:bg-background fixed left-0 top-0 bottom-0 flex flex-col z-40 hidden md:flex">
<div class="px-6 py-6 flex items-center gap-3">
<div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center border border-border">
<span class="material-symbols-outlined text-primary text-[20px]" data-icon="hub">hub</span>
</div>
<div>
<h1 class="font-headline-md text-headline-md text-primary dark:text-on-background">DocLab</h1>
<p class="font-label-sm text-label-sm text-text-muted">Healthcare ML</p>
</div>
</div>
<div class="px-4 mb-6">
<button class="w-full flex items-center justify-center gap-2 bg-primary text-on-primary h-10 rounded-lg hover:opacity-90 transition-opacity font-body-md text-body-md cursor-pointer active:scale-95 transition-transform">
<span class="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                New Prototype
            </button>
</div>
<nav class="flex-1 px-4 space-y-1">
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="add_box">add_box</span>
<span class="font-body-md text-body-md">New Prototype</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="science">science</span>
<span class="font-body-md text-body-md">Experiments</span>
</a>
<!-- Active State -->
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary dark:text-on-background font-bold border-r-2 border-primary bg-surface-container-low cursor-pointer active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="database">database</span>
<span class="font-body-md text-body-md">Datasets</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="model_training">model_training</span>
<span class="font-body-md text-body-md">Models</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="settings">settings</span>
<span class="font-body-md text-body-md">Settings</span>
</a>
</nav>
<div class="px-4 py-6 border-t border-border mt-auto">
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="description">description</span>
<span class="font-body-md text-body-md">Documentation</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="help">help</span>
<span class="font-body-md text-body-md">Support</span>
</a>
</div>
</aside>
<!-- Main Content Area -->
<div class="flex-1 ml-[220px] max-w-[calc(100%-220px)] flex flex-col min-h-screen">
<!-- TopAppBar (Shared Component) -->
<header class="sticky top-0 z-50 flex justify-between items-center px-page-padding h-16 w-full bg-surface dark:bg-surface border-b border-border dark:border-outline flat no shadows">
<div class="flex items-center gap-4">
<div class="relative w-64">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]" data-icon="search">search</span>
<input class="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface-container-low text-body-md font-body-md focus:outline-none focus:border-border-strong focus:ring-0 placeholder:text-text-muted" placeholder="Search datasets..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<button class="h-9 px-4 bg-primary text-on-primary rounded-lg font-body-md text-body-md hover:opacity-90 transition-opacity">Deploy Model</button>
<div class="flex items-center gap-2 border-l border-border pl-4">
<button class="w-8 h-8 flex items-center justify-center text-text-secondary dark:text-text-disabled hover:text-primary dark:hover:text-on-surface transition-colors duration-200 ease-in-out rounded-full hover:bg-surface-container">
<span class="material-symbols-outlined text-[20px]" data-icon="notifications">notifications</span>
</button>
<button class="w-8 h-8 flex items-center justify-center text-text-secondary dark:text-text-disabled hover:text-primary dark:hover:text-on-surface transition-colors duration-200 ease-in-out rounded-full hover:bg-surface-container">
<span class="material-symbols-outlined text-[20px]" data-icon="account_circle">account_circle</span>
</button>
</div>
</div>
</header>
<!-- Page Content -->
<main class="flex-1 px-page-padding py-8 max-w-max-content-width mx-auto w-full">
<!-- Header Section -->
<div class="flex items-end justify-between mb-8">
<div>
<h2 class="font-headline-lg text-headline-lg text-text-primary mb-1">Datasets</h2>
<p class="font-body-md text-body-md text-text-secondary">Manage and access healthcare datasets for model training.</p>
</div>
<button class="h-10 px-4 bg-surface text-text-primary border border-border-strong rounded-lg font-body-md text-body-md hover:bg-surface-container-low transition-colors flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                    Request New Dataset
                </button>
</div>
<!-- Bento Grid Layout for Datasets -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap-md">
<!-- Dataset Card 1 -->
<div class="bg-surface rounded-xl border border-border p-5 flex flex-col hover:border-border-strong transition-colors cursor-pointer group">
<div class="flex justify-between items-start mb-4">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-border">
<span class="material-symbols-outlined text-text-secondary text-[20px]" data-icon="table_chart">table_chart</span>
</div>
<span class="px-2 py-1 bg-surface-muted text-text-secondary rounded font-label-sm text-label-sm border border-border">Indexed</span>
</div>
<h3 class="font-headline-md text-headline-md text-text-primary mb-1">MIMIC-III Clinical Database</h3>
<p class="font-body-md text-body-md text-text-muted line-clamp-2 mb-4">De-identified health-related data associated with over forty thousand patients who stayed in critical care units.</p>
<div class="mt-auto space-y-2 pt-4 border-t border-border border-dashed">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-text-muted">Source</span>
<span class="text-text-secondary font-medium">PhysioNet</span>
</div>
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-text-muted">Type</span>
<span class="text-text-secondary font-medium">Tabular / Time-series</span>
</div>
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-text-muted">Size</span>
<span class="text-text-secondary font-medium font-code-sm text-code-sm">46.5M Rows</span>
</div>
</div>
</div>
<!-- Dataset Card 2 -->
<div class="bg-surface rounded-xl border border-border p-5 flex flex-col hover:border-border-strong transition-colors cursor-pointer group">
<div class="flex justify-between items-start mb-4">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-border">
<span class="material-symbols-outlined text-text-secondary text-[20px]" data-icon="image">image</span>
</div>
<span class="px-2 py-1 bg-surface-muted text-text-secondary rounded font-label-sm text-label-sm border border-border">Indexed</span>
</div>
<h3 class="font-headline-md text-headline-md text-text-primary mb-1">Chest X-Ray 14</h3>
<p class="font-body-md text-body-md text-text-muted line-clamp-2 mb-4">Hospital-scale chest X-ray database and benchmarks on weakly-supervised classification and localization of common thorax diseases.</p>
<div class="mt-auto space-y-2 pt-4 border-t border-border border-dashed">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-text-muted">Source</span>
<span class="text-text-secondary font-medium">NIH</span>
</div>
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-text-muted">Type</span>
<span class="text-text-secondary font-medium">Image</span>
</div>
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-text-muted">Size</span>
<span class="text-text-secondary font-medium font-code-sm text-code-sm">112,120 Files</span>
</div>
</div>
</div>
<!-- Dataset Card 3 -->
<div class="bg-surface rounded-xl border border-border p-5 flex flex-col hover:border-border-strong transition-colors cursor-pointer group">
<div class="flex justify-between items-start mb-4">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-border">
<span class="material-symbols-outlined text-text-secondary text-[20px]" data-icon="show_chart">show_chart</span>
</div>
<span class="px-2 py-1 bg-warning-bg text-warning-text rounded font-label-sm text-label-sm border border-warning-text/20">Pending Sync</span>
</div>
<h3 class="font-headline-md text-headline-md text-text-primary mb-1">ECG Heartbeat Categorization</h3>
<p class="font-body-md text-body-md text-text-muted line-clamp-2 mb-4">Dataset containing ECG signals for training models in heartbeat classification and anomaly detection.</p>
<div class="mt-auto space-y-2 pt-4 border-t border-border border-dashed">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-text-muted">Source</span>
<span class="text-text-secondary font-medium">Kaggle / PTB</span>
</div>
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-text-muted">Type</span>
<span class="text-text-secondary font-medium">Time-series</span>
</div>
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-text-muted">Size</span>
<span class="text-text-secondary font-medium font-code-sm text-code-sm">109.4K Rows</span>
</div>
</div>
</div>
<!-- Empty State / Add New Card (Span across depending on items) -->
<div class="bg-surface-container-low rounded-xl border border-border border-dashed p-5 flex flex-col items-center justify-center text-center hover:bg-surface-container transition-colors cursor-pointer min-h-[240px]">
<div class="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3">
<span class="material-symbols-outlined text-text-secondary text-[24px]" data-icon="add">add</span>
</div>
<h3 class="font-headline-md text-headline-md text-text-primary mb-1">Connect Repository</h3>
<p class="font-body-md text-body-md text-text-muted max-w-[200px]">Link a new external bucket or database connection.</p>
</div>
</div>
</main>
</div>
</body></html>

<!-- DocLab: Agent Plan -->
<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>DocLab - Agent Plan</title>
<!-- Material Symbols Outlined -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect">
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&amp;family=JetBrains+Mono:wght@400&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "secondary-container": "#dfe0e0",
                        "surface-container-high": "#ebe7e6",
                        "inverse-surface": "#313030",
                        "error-container": "#ffdad6",
                        "surface-tint": "#5f5e5e",
                        "background": "#fafafa",
                        "outline-variant": "#c4c7c7",
                        "secondary-fixed": "#e2e2e2",
                        "tertiary-fixed": "#e6e2df",
                        "on-tertiary-container": "#868382",
                        "text-primary": "#171717",
                        "on-primary-container": "#858383",
                        "on-tertiary-fixed": "#1c1b1a",
                        "log-bg": "#0a0a0a",
                        "on-secondary-fixed-variant": "#454747",
                        "error": "#ba1a1a",
                        "on-primary-fixed-variant": "#474746",
                        "on-error": "#ffffff",
                        "surface-container-low": "#f7f3f2",
                        "success-bg": "#f0fdf4",
                        "surface-container": "#f1edec",
                        "on-secondary": "#ffffff",
                        "surface-bright": "#fdf8f8",
                        "warning-text": "#92400e",
                        "on-surface-variant": "#444748",
                        "inverse-primary": "#c8c6c5",
                        "tertiary": "#000000",
                        "on-error-container": "#93000a",
                        "log-text": "#e5e5e5",
                        "surface-variant": "#e5e2e1",
                        "primary": "#000000",
                        "on-secondary-fixed": "#1a1c1c",
                        "on-background": "#1c1b1b",
                        "surface": "#ffffff", /* Adjusted to match standard white surface expectation for cards */
                        "text-secondary": "#525252",
                        "on-tertiary-fixed-variant": "#484645",
                        "error-bg": "#fef2f2",
                        "warning-bg": "#fffbeb",
                        "surface-dim": "#ddd9d8",
                        "surface-container-lowest": "#ffffff",
                        "tertiary-container": "#1c1b1a",
                        "text-disabled": "#a3a3a3",
                        "on-primary-fixed": "#1c1b1b",
                        "on-primary": "#ffffff",
                        "outline": "#747878",
                        "border-strong": "#d4d4d4",
                        "primary-fixed-dim": "#c8c6c5",
                        "primary-fixed": "#e5e2e1",
                        "success-text": "#166534",
                        "surface-muted": "#f5f5f5",
                        "tertiary-fixed-dim": "#cac6c4",
                        "secondary-fixed-dim": "#c6c6c7",
                        "surface-container-highest": "#e5e2e1",
                        "border": "#e5e5e5",
                        "text-muted": "#737373",
                        "on-tertiary": "#ffffff",
                        "error-text": "#991b1b",
                        "secondary": "#5d5f5f",
                        "inverse-on-surface": "#f4f0ef",
                        "on-secondary-container": "#616363",
                        "on-surface": "#1c1b1b",
                        "primary-container": "#1c1b1b"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "gap-md": "16px",
                        "page-padding": "32px",
                        "sidebar-width": "220px",
                        "max-content-width": "1080px",
                        "gap-lg": "24px"
                    },
                    "fontFamily": {
                        "headline-md": ["Inter"],
                        "code-sm": ["JetBrains Mono"],
                        "headline-lg": ["Inter"],
                        "label-sm": ["Inter"],
                        "body-md": ["Inter"]
                    },
                    "fontSize": {
                        "headline-md": ["16px", {"lineHeight": "24px", "fontWeight": "600"}],
                        "code-sm": ["12px", {"lineHeight": "18px", "fontWeight": "400"}],
                        "headline-lg": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "label-sm": ["12px", {"lineHeight": "18px", "fontWeight": "400"}],
                        "body-md": ["14px", {"lineHeight": "22px", "fontWeight": "400"}]
                    }
                }
            }
        }
    </script>
<style>
        body { background-color: #fafafa; }
    </style>
</head>
<body class="bg-background text-text-primary flex min-h-screen font-body-md">
<!-- SideNavBar Component -->
<aside class="fixed left-0 top-0 bottom-0 flex flex-col w-[220px] h-screen border-r border-border dark:border-outline bg-background dark:bg-background z-40">
<!-- Header -->
<div class="p-4 border-b border-border dark:border-outline flex items-center gap-3">
<div class="w-8 h-8 rounded bg-surface-muted border border-border flex items-center justify-center overflow-hidden">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">dataset</span>
</div>
<div>
<h1 class="font-headline-md text-headline-md text-primary dark:text-on-background">DocLab</h1>
<p class="font-label-sm text-label-sm text-text-muted">Healthcare ML</p>
</div>
</div>
<!-- CTA -->
<div class="p-4">
<button class="w-full bg-primary text-on-primary font-body-md text-body-md py-2 px-4 hover:bg-surface-tint transition-colors flex items-center justify-center gap-2 rounded-full">
<span class="material-symbols-outlined text-[18px]">add</span>
                New Prototype
            </button>
</div>
<!-- Tabs -->
<nav class="flex-1 overflow-y-auto py-2">
<ul class="space-y-1 px-2">
<!-- Active Tab: New Prototype -->
<li class="">
<a class="flex items-center gap-3 px-3 py-2 text-primary dark:text-on-background font-bold border-r-2 border-primary bg-surface-container dark:bg-surface-container-high cursor-pointer active:scale-95 transition-transform rounded-full" href="#">
<span class="material-symbols-outlined" data-icon="add_box">add_box</span>
<span class="font-body-md text-body-md">New Prototype</span>
</a>
</li>
<!-- Inactive Tabs -->
<li class="">
<a class="flex items-center gap-3 px-3 py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform rounded-full" href="#">
<span class="material-symbols-outlined" data-icon="science">science</span>
<span class="font-body-md text-body-md">Experiments</span>
</a>
</li>
<li class="">
<a class="flex items-center gap-3 px-3 py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform rounded-full" href="#">
<span class="material-symbols-outlined" data-icon="database">database</span>
<span class="font-body-md text-body-md">Datasets</span>
</a>
</li>
<li class="">
<a class="flex items-center gap-3 px-3 py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform rounded-full" href="#">
<span class="material-symbols-outlined" data-icon="model_training">model_training</span>
<span class="font-body-md text-body-md">Models</span>
</a>
</li>
<li class="">
<a class="flex items-center gap-3 px-3 py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform rounded-full" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-body-md text-body-md">Settings</span>
</a>
</li>
</ul>
</nav>
<!-- Footer Tabs -->
<div class="p-2 border-t border-border dark:border-outline">
<ul class="space-y-1">
<li class="">
<a class="flex items-center gap-3 px-3 py-2 rounded text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="description">description</span>
<span class="font-body-md text-body-md">Documentation</span>
</a>
</li>
<li class="">
<a class="flex items-center gap-3 px-3 py-2 rounded text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="help">help</span>
<span class="font-body-md text-body-md">Support</span>
</a>
</li>
</ul>
</div>
</aside>
<!-- Main Wrapper -->
<div class="flex-1 ml-[220px] flex flex-col min-h-screen max-w-[calc(100%-220px)] w-full relative">
<!-- TopAppBar Component -->
<header class="sticky top-0 z-50 flex justify-between items-center px-page-padding h-16 w-full border-b border-border dark:border-outline bg-surface dark:bg-surface">
<!-- Left: Brand Logo & Optional Search (Search not explicitly requested in visually active state, keeping minimal per JSON search_bar: 'on_left' implied location) -->
<div class="flex items-center gap-4">
<span class="font-headline-lg text-headline-lg text-primary dark:text-on-surface tracking-tight">DocLab</span>
</div>
<!-- Right: Actions -->
<div class="flex items-center gap-4">
<div class="flex items-center text-text-secondary dark:text-text-disabled">
<button class="p-2 hover:text-primary dark:hover:text-on-surface transition-colors duration-200 ease-in-out">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button class="p-2 hover:text-primary dark:hover:text-on-surface transition-colors duration-200 ease-in-out">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
<button class="bg-surface border border-border text-text-primary px-4 py-2 rounded font-headline-md text-headline-md hover:bg-surface-muted transition-colors">
                    Deploy Model
                </button>
</div>
</header>
<!-- Main Content Area -->
<main class="flex-1 p-page-padding overflow-y-auto">
<div class="max-w-max-content-width mx-auto space-y-gap-lg">
<!-- Page Header & Stepper -->
<div class="flex flex-col gap-4">
<h2 class="font-headline-lg text-headline-lg text-primary">Prototype Initialization</h2>
<!-- Progress Stepper (Visual Context) -->
<div class="flex items-center gap-2 text-label-sm font-label-sm text-text-muted">
<span class="flex items-center gap-1 text-success-text"><span class="material-symbols-outlined text-[16px]">check_circle</span> Goal Def</span>
<span class="w-8 h-[1px] bg-border-strong"></span>
<span class="flex items-center gap-1 text-primary font-bold"><span class="material-symbols-outlined text-[16px] animate-pulse">model_training</span> Agent Plan</span>
<span class="w-8 h-[1px] bg-border-strong"></span>
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">data_exploration</span> Training</span>
<span class="w-8 h-[1px] bg-border-strong"></span>
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">analytics</span> Evaluation</span>
</div>
</div>
<!-- Agent Plan Panel (Bento Grid Style) -->
<div class="bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
<!-- Panel Header -->
<div class="bg-surface-muted border-b border-border px-6 py-4 flex justify-between items-center">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">memory</span>
<h3 class="font-headline-md text-headline-md text-primary">ML Planning Agent Compilation</h3>
</div>
<span class="bg-surface-container-high text-text-secondary px-2 py-1 rounded text-code-sm font-code-sm">Status: Ready</span>
</div>
<!-- Panel Content Grid -->
<div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-gap-md">
<!-- Goal Section (Full Width) -->
<div class="col-span-1 md:col-span-2 border border-border rounded p-4 bg-background">
<h4 class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider mb-2">Primary Objective</h4>
<p class="font-headline-md text-headline-md text-primary">Predict hospital readmission risk</p>
</div>
<!-- Task & Data Types -->
<div class="border border-border rounded p-4 bg-background space-y-4">
<div>
<h4 class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider mb-1">Task Type</h4>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[18px]">category</span>
<span class="font-body-md text-text-primary">Classification</span>
</div>
</div>
<div class="pt-2 border-t border-border">
<h4 class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider mb-1">Data Modality</h4>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[18px]">table_rows</span>
<span class="font-body-md text-text-primary">Tabular healthcare data</span>
</div>
</div>
</div>
<!-- Selected Dataset -->
<div class="border border-border rounded p-4 bg-background flex flex-col justify-between">
<div>
<h4 class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider mb-2">Selected Dataset</h4>
<p class="font-body-md text-text-primary mb-3">Indexed healthcare dataset retrieved from registry.</p>
</div>
<div class="bg-log-bg p-3 rounded flex items-center justify-between border border-surface-tint">
<code class="font-code-sm text-code-sm text-log-text">hf://datasets/mimic-iv-readmission</code>
<span class="material-symbols-outlined text-text-muted text-[16px] cursor-pointer hover:text-log-text">content_copy</span>
</div>
</div>
<!-- Model Choice & Metric (Full Width) -->
<div class="col-span-1 md:col-span-2 border border-border rounded p-4 bg-background grid grid-cols-1 md:grid-cols-3 gap-6">
<div class="md:col-span-1 border-r-0 md:border-r border-border pr-4">
<h4 class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider mb-2">Architecture</h4>
<p class="font-headline-md text-headline-md text-primary mb-1">XGBoost Classifier</p>
<span class="inline-block bg-surface-muted text-text-secondary px-2 py-0.5 rounded text-code-sm font-code-sm border border-border-strong mt-1">v2.0.3</span>
</div>
<div class="md:col-span-1 border-r-0 md:border-r border-border pr-4">
<h4 class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider mb-2">Target Metric</h4>
<p class="font-headline-md text-headline-md text-primary">Accuracy</p>
<p class="font-label-sm text-text-muted mt-1">Secondary: F1-Score, ROC-AUC</p>
</div>
<div class="md:col-span-1">
<h4 class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider mb-2">Agent Rationale</h4>
<p class="font-body-md text-text-primary text-sm leading-relaxed">
                                    XGBoost was selected due to its superior performance and native handling of non-linear relationships within structured tabular healthcare data. It inherently manages missing values common in clinical records and provides interpretable feature importance, which is critical for medical deployment.
                                </p>
</div>
</div>
</div>
<!-- Panel Footer / Action -->
<div class="bg-background border-t border-border px-6 py-4 flex justify-end items-center gap-3">
<button class="px-4 py-2 rounded font-body-md text-text-primary hover:bg-surface-muted transition-colors border border-transparent hover:border-border">
                            Edit Parameters
                        </button>
<button class="bg-primary text-on-primary px-6 py-2 rounded font-headline-md text-headline-md hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">play_arrow</span>
                            Start Training
                        </button>
</div>
</div>
<!-- Minimalist Log/Terminal Preview (Optional visual flavor for an Agent tool) -->
<div class="bg-log-bg rounded-lg border border-[#2a2a2a] p-4 text-log-text font-code-sm text-code-sm mt-8 opacity-80 hover:opacity-100 transition-opacity">
<div class="flex items-center gap-2 mb-2 text-[#888]">
<span class="material-symbols-outlined text-[14px]">terminal</span>
<span class="">Agent Execution Log</span>
</div>
<div class="space-y-1">
<p class=""><span class="text-success-text">[OK]</span> Parsed intent: "predict readmissions"</p>
<p class=""><span class="text-success-text">[OK]</span> Queried dataset registry: 1 match found</p>
<p class=""><span class="text-success-text">[OK]</span> Evaluated model candidates: LogisticRegression, RandomForest, XGBoost</p>
<p class=""><span class="text-[#888]">&gt;</span> Plan finalized and awaiting user confirmation...</p>
</div>
</div>
</div>
</main>
</div>


</body></html>

<!-- DocLab: Training Progress -->
<!DOCTYPE html><html class="dark" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>DocLab - Training Progress</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&amp;family=JetBrains+Mono:wght@400&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&amp;display=swap" rel="stylesheet">
<style>
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
        }
        .fill-icon {
            font-variation-settings: 'FILL' 1;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "secondary-container": "#dfe0e0",
                        "surface-container-high": "#ebe7e6",
                        "inverse-surface": "#313030",
                        "error-container": "#ffdad6",
                        "surface-tint": "#5f5e5e",
                        "background": "#fafafa",
                        "outline-variant": "#c4c7c7",
                        "secondary-fixed": "#e2e2e2",
                        "tertiary-fixed": "#e6e2df",
                        "on-tertiary-container": "#868382",
                        "text-primary": "#171717",
                        "on-primary-container": "#858383",
                        "on-tertiary-fixed": "#1c1b1a",
                        "log-bg": "#0a0a0a",
                        "on-secondary-fixed-variant": "#454747",
                        "error": "#ba1a1a",
                        "on-primary-fixed-variant": "#474746",
                        "on-error": "#ffffff",
                        "surface-container-low": "#f7f3f2",
                        "success-bg": "#f0fdf4",
                        "surface-container": "#f1edec",
                        "on-secondary": "#ffffff",
                        "surface-bright": "#fdf8f8",
                        "warning-text": "#92400e",
                        "on-surface-variant": "#444748",
                        "inverse-primary": "#c8c6c5",
                        "tertiary": "#000000",
                        "on-error-container": "#93000a",
                        "log-text": "#e5e5e5",
                        "surface-variant": "#e5e2e1",
                        "primary": "#000000",
                        "on-secondary-fixed": "#1a1c1c",
                        "on-background": "#1c1b1b",
                        "surface": "#fdf8f8",
                        "text-secondary": "#525252",
                        "on-tertiary-fixed-variant": "#484645",
                        "error-bg": "#fef2f2",
                        "warning-bg": "#fffbeb",
                        "surface-dim": "#ddd9d8",
                        "surface-container-lowest": "#ffffff",
                        "tertiary-container": "#1c1b1a",
                        "text-disabled": "#a3a3a3",
                        "on-primary-fixed": "#1c1b1b",
                        "on-primary": "#ffffff",
                        "outline": "#747878",
                        "border-strong": "#d4d4d4",
                        "primary-fixed-dim": "#c8c6c5",
                        "primary-fixed": "#e5e2e1",
                        "success-text": "#166534",
                        "surface-muted": "#f5f5f5",
                        "tertiary-fixed-dim": "#cac6c4",
                        "secondary-fixed-dim": "#c6c6c7",
                        "surface-container-highest": "#e5e2e1",
                        "border": "#e5e5e5",
                        "text-muted": "#737373",
                        "on-tertiary": "#ffffff",
                        "error-text": "#991b1b",
                        "secondary": "#5d5f5f",
                        "inverse-on-surface": "#f4f0ef",
                        "on-secondary-container": "#616363",
                        "on-surface": "#1c1b1b",
                        "primary-container": "#1c1b1b"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "gap-md": "16px",
                        "page-padding": "32px",
                        "sidebar-width": "220px",
                        "max-content-width": "1080px",
                        "gap-lg": "24px"
                    },
                    "fontFamily": {
                        "headline-md": ["Inter"],
                        "code-sm": ["JetBrains Mono"],
                        "headline-lg": ["Inter"],
                        "label-sm": ["Inter"],
                        "body-md": ["Inter"]
                    },
                    "fontSize": {
                        "headline-md": ["16px", { "lineHeight": "24px", "fontWeight": "600" }],
                        "code-sm": ["12px", { "lineHeight": "18px", "fontWeight": "400" }],
                        "headline-lg": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                        "label-sm": ["12px", { "lineHeight": "18px", "fontWeight": "400" }],
                        "body-md": ["14px", { "lineHeight": "22px", "fontWeight": "400" }]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-background text-text-primary font-body-md text-body-md antialiased flex">
<!-- SideNavBar -->
<nav class="w-[220px] h-screen border-r border-border dark:border-outline bg-background dark:bg-background fixed left-0 top-0 bottom-0 flex flex-col z-40">
<div class="p-gap-lg flex flex-col items-center border-b border-border dark:border-outline">
<div class="w-16 h-16 rounded-full bg-surface-muted border border-border flex items-center justify-center mb-4 overflow-hidden">
<span class="material-symbols-outlined text-outline" style="font-size: 32px;">account_circle</span>
</div>
<h1 class="font-headline-md text-headline-md text-primary dark:text-on-background">DocLab</h1>
<p class="font-label-sm text-label-sm text-text-muted">Healthcare ML</p>
</div>
<div class="px-4 py-6">
<button class="w-full bg-primary text-on-primary py-2 px-4 rounded-full font-headline-md text-headline-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
<span class="material-symbols-outlined" style="font-size: 20px;">add</span>
                New Prototype
            </button>
</div>
<ul class="flex-1 overflow-y-auto py-2">
<li class="">
<a class="flex items-center gap-3 px-6 py-3 cursor-pointer active:scale-95 transition-transform hover:bg-surface-container dark:hover:bg-surface-container-high text-text-muted dark:text-text-disabled rounded-full mx-2" href="#">
<span class="material-symbols-outlined" data-icon="add_box">add_box</span>
<span class="font-body-md text-body-md">New Prototype</span>
</a>
</li>
<li class="">
<a class="flex items-center gap-3 px-6 py-3 cursor-pointer active:scale-95 transition-transform hover:bg-surface-container dark:hover:bg-surface-container-high text-primary dark:text-on-background font-bold bg-surface-container rounded-full mx-2" href="#">
<span class="material-symbols-outlined" data-icon="science">science</span>
<span class="font-body-md text-body-md">Experiments</span>
</a>
</li>
<li class="">
<a class="flex items-center gap-3 px-6 py-3 cursor-pointer active:scale-95 transition-transform hover:bg-surface-container dark:hover:bg-surface-container-high text-text-muted dark:text-text-disabled rounded-full mx-2" href="#">
<span class="material-symbols-outlined" data-icon="database">database</span>
<span class="font-body-md text-body-md">Datasets</span>
</a>
</li>
<li class="">
<a class="flex items-center gap-3 px-6 py-3 cursor-pointer active:scale-95 transition-transform hover:bg-surface-container dark:hover:bg-surface-container-high text-text-muted dark:text-text-disabled rounded-full mx-2" href="#">
<span class="material-symbols-outlined" data-icon="model_training">model_training</span>
<span class="font-body-md text-body-md">Models</span>
</a>
</li>
<li class="">
<a class="flex items-center gap-3 px-6 py-3 cursor-pointer active:scale-95 transition-transform hover:bg-surface-container dark:hover:bg-surface-container-high text-text-muted dark:text-text-disabled rounded-full mx-2" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-body-md text-body-md">Settings</span>
</a>
</li>
</ul>
<div class="border-t border-border dark:border-outline py-4">
<ul class="flex flex-col">
<li class="">
<a class="flex items-center gap-3 px-6 py-2 cursor-pointer hover:bg-surface-container transition-colors text-text-muted dark:text-text-disabled" href="#">
<span class="material-symbols-outlined" data-icon="description" style="font-size: 20px;">description</span>
<span class="font-body-md text-body-md">Documentation</span>
</a>
</li>
<li class="">
<a class="flex items-center gap-3 px-6 py-2 cursor-pointer hover:bg-surface-container transition-colors text-text-muted dark:text-text-disabled" href="#">
<span class="material-symbols-outlined" data-icon="help" style="font-size: 20px;">help</span>
<span class="font-body-md text-body-md">Support</span>
</a>
</li>
</ul>
</div>
</nav>
<!-- Main Content Area -->
<div class="flex-1 ml-[220px] flex flex-col min-h-screen">
<!-- TopAppBar -->
<header class="bg-surface dark:bg-surface border-b border-border dark:border-outline sticky top-0 z-50 flex justify-between items-center px-page-padding h-16 w-full max-w-[calc(100%-0px)]">
<div class="flex items-center gap-4">
<span class="font-headline-lg text-headline-lg text-primary dark:text-on-surface tracking-tight">DocLab</span>
</div>
<div class="flex items-center gap-4">
<button class="text-text-secondary dark:text-text-disabled hover:text-primary dark:hover:text-on-surface transition-colors duration-200 ease-in-out p-2 rounded-full">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button class="text-text-secondary dark:text-text-disabled hover:text-primary dark:hover:text-on-surface transition-colors duration-200 ease-in-out p-2 rounded-full">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
<button class="bg-primary text-on-primary px-4 py-2 rounded font-headline-md text-headline-md ml-2 hover:opacity-90 transition-opacity">
                    Deploy Model
                </button>
</div>
</header>
<!-- Main Canvas -->
<main class="flex-1 p-page-padding overflow-y-auto">
<div class="max-w-max-content-width mx-auto">
<div class="mb-8">
<h2 class="font-headline-lg text-headline-lg text-primary mb-2">Training Progress</h2>
<p class="text-text-muted font-body-md">Autonomous model training initialized for Exp-042-Cardio.</p>
</div>
<div class="bg-surface border border-border rounded-lg p-8 mb-6">
<div class="flex flex-col gap-6 relative">
<!-- Progress Line connecting steps -->
<div class="absolute left-4 top-4 bottom-8 w-px bg-border-strong z-0"></div>
<!-- Step 1: Done -->
<div class="flex gap-6 relative z-10">
<div class="w-8 h-8 rounded-full bg-success-bg border border-success-text flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-success-text" style="font-size: 16px;">check</span>
</div>
<div class="pt-1">
<h3 class="font-headline-md text-headline-md text-primary">Dataset selected</h3>
<p class="text-text-muted font-label-sm mt-1">MIMIC-III clinical database mapped.</p>
</div>
</div>
<!-- Step 2: Done -->
<div class="flex gap-6 relative z-10">
<div class="w-8 h-8 rounded-full bg-success-bg border border-success-text flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-success-text" style="font-size: 16px;">check</span>
</div>
<div class="pt-1">
<h3 class="font-headline-md text-headline-md text-primary">Dataset inspected</h3>
<p class="text-text-muted font-label-sm mt-1">Found 45,000 viable records. Addressed missing values in BP column.</p>
</div>
</div>
<!-- Step 3: Done -->
<div class="flex gap-6 relative z-10">
<div class="w-8 h-8 rounded-full bg-success-bg border border-success-text flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-success-text" style="font-size: 16px;">check</span>
</div>
<div class="pt-1">
<h3 class="font-headline-md text-headline-md text-primary">Data prepared</h3>
<p class="text-text-muted font-label-sm mt-1">Features normalized. Categorical variables encoded.</p>
</div>
</div>
<!-- Step 4: Done -->
<div class="flex gap-6 relative z-10">
<div class="w-8 h-8 rounded-full bg-success-bg border border-success-text flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-success-text" style="font-size: 16px;">check</span>
</div>
<div class="pt-1">
<h3 class="font-headline-md text-headline-md text-primary">Train/eval/test split created</h3>
<p class="text-text-muted font-label-sm mt-1">80% / 10% / 10% stratified split applied.</p>
</div>
</div>
<!-- Step 5: Active -->
<div class="flex gap-6 relative z-10">
<div class="w-8 h-8 rounded-full bg-surface border-2 border-primary flex items-center justify-center shrink-0">
<div class="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
</div>
<div class="pt-1 w-full max-w-2xl">
<h3 class="font-headline-md text-headline-md text-primary">Model training</h3>
<div class="mt-3 bg-surface-muted rounded border border-border p-4">
<div class="flex justify-between items-center mb-2">
<span class="font-label-sm text-text-secondary">Epoch 14/50</span>
<span class="font-label-sm text-text-secondary">Loss: 0.3421</span>
</div>
<div class="w-full bg-border rounded-full h-1.5">
<div class="bg-primary h-1.5 rounded-full" style="width: 28%"></div>
</div>
</div>
</div>
</div>
<!-- Step 6: Pending -->
<div class="flex gap-6 relative z-10">
<div class="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center shrink-0">
</div>
<div class="pt-1 opacity-50">
<h3 class="font-headline-md text-headline-md text-text-primary">Evaluation</h3>
</div>
</div>
<!-- Step 7: Pending -->
<div class="flex gap-6 relative z-10">
<div class="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center shrink-0">
</div>
<div class="pt-1 opacity-50">
<h3 class="font-headline-md text-headline-md text-text-primary">Best checkpoint saved</h3>
</div>
</div>
<!-- Step 8: Pending -->
<div class="flex gap-6 relative z-10">
<div class="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center shrink-0">
</div>
<div class="pt-1 opacity-50">
<h3 class="font-headline-md text-headline-md text-text-primary">Model card generated</h3>
</div>
</div>
</div>
</div>
<!-- Technical Logs Section -->
<div class="border border-border rounded-lg overflow-hidden bg-surface">
<button class="w-full flex items-center justify-between p-4 bg-surface-muted hover:bg-surface-container transition-colors focus:outline-none" id="log-toggle">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-text-secondary" style="font-size: 20px;">terminal</span>
<span class="font-headline-md text-headline-md text-primary">Technical logs</span>
</div>
<span class="material-symbols-outlined text-text-secondary transition-transform duration-200" id="log-icon">expand_less</span>
</button>
<div class="bg-log-bg p-4 h-64 overflow-y-auto" id="log-content">
<pre class="font-code-sm text-code-sm text-log-text whitespace-pre-wrap">[10:42:01] INFO: Initializing training environment...
[10:42:02] INFO: Loading dataset MIMIC-III (45,000 rows)...
[10:42:05] WARN: Found 124 missing values in 'blood_pressure_systolic'. Imputing with median.
[10:42:06] INFO: Dataset preprocessing complete.
[10:42:06] INFO: Creating train/eval/test split (0.8/0.1/0.1)...
[10:42:07] INFO: Building model architecture: ResNet-based tabular feature extractor.
[10:42:08] INFO: Starting training loop. Batch size: 128, Learning rate: 0.001
[10:42:15] DEBUG: Epoch 1/50 - Loss: 1.2045 - Val Loss: 1.1532
[10:43:02] DEBUG: Epoch 5/50 - Loss: 0.8421 - Val Loss: 0.8911
[10:44:10] DEBUG: Epoch 10/50 - Loss: 0.5123 - Val Loss: 0.5899
[10:45:33] DEBUG: Epoch 14/50 - Loss: 0.3421 - Val Loss: 0.4102
[10:45:33] INFO: Saving temporary checkpoint...
_</pre>
</div>
</div>
</div>
</main>
</div>
<script>
        document.getElementById('log-toggle').addEventListener('click', function() {
            const content = document.getElementById('log-content');
            const icon = document.getElementById('log-icon');
            
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.display = 'none';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    </script>


</body></html>

<!-- DocLab: New Prototype -->
<!DOCTYPE html><html class="h-full" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>DocLab - New Prototype</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&amp;family=JetBrains+Mono:wght@400&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "secondary-container": "#dfe0e0",
                        "surface-container-high": "#ebe7e6",
                        "inverse-surface": "#313030",
                        "error-container": "#ffdad6",
                        "surface-tint": "#5f5e5e",
                        "background": "#fafafa",
                        "outline-variant": "#c4c7c7",
                        "secondary-fixed": "#e2e2e2",
                        "tertiary-fixed": "#e6e2df",
                        "on-tertiary-container": "#868382",
                        "text-primary": "#171717",
                        "on-primary-container": "#858383",
                        "on-tertiary-fixed": "#1c1b1a",
                        "log-bg": "#0a0a0a",
                        "on-secondary-fixed-variant": "#454747",
                        "error": "#ba1a1a",
                        "on-primary-fixed-variant": "#474746",
                        "on-error": "#ffffff",
                        "surface-container-low": "#f7f3f2",
                        "success-bg": "#f0fdf4",
                        "surface-container": "#f1edec",
                        "on-secondary": "#ffffff",
                        "surface-bright": "#fdf8f8",
                        "warning-text": "#92400e",
                        "on-surface-variant": "#444748",
                        "inverse-primary": "#c8c6c5",
                        "tertiary": "#000000",
                        "on-error-container": "#93000a",
                        "log-text": "#e5e5e5",
                        "surface-variant": "#e5e2e1",
                        "primary": "#000000",
                        "on-secondary-fixed": "#1a1c1c",
                        "on-background": "#1c1b1b",
                        "surface": "#fdf8f8",
                        "text-secondary": "#525252",
                        "on-tertiary-fixed-variant": "#484645",
                        "error-bg": "#fef2f2",
                        "warning-bg": "#fffbeb",
                        "surface-dim": "#ddd9d8",
                        "surface-container-lowest": "#ffffff",
                        "tertiary-container": "#1c1b1a",
                        "text-disabled": "#a3a3a3",
                        "on-primary-fixed": "#1c1b1b",
                        "on-primary": "#ffffff",
                        "outline": "#747878",
                        "border-strong": "#d4d4d4",
                        "primary-fixed-dim": "#c8c6c5",
                        "primary-fixed": "#e5e2e1",
                        "success-text": "#166534",
                        "surface-muted": "#f5f5f5",
                        "tertiary-fixed-dim": "#cac6c4",
                        "secondary-fixed-dim": "#c6c6c7",
                        "surface-container-highest": "#e5e2e1",
                        "border": "#e5e5e5",
                        "text-muted": "#737373",
                        "on-tertiary": "#ffffff",
                        "error-text": "#991b1b",
                        "secondary": "#5d5f5f",
                        "inverse-on-surface": "#f4f0ef",
                        "on-secondary-container": "#616363",
                        "on-surface": "#1c1b1b",
                        "primary-container": "#1c1b1b"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "gap-md": "16px",
                        "page-padding": "32px",
                        "sidebar-width": "220px",
                        "max-content-width": "1080px",
                        "gap-lg": "24px"
                    },
                    "fontFamily": {
                        "headline-md": ["Inter"],
                        "code-sm": ["JetBrains Mono"],
                        "headline-lg": ["Inter"],
                        "label-sm": ["Inter"],
                        "body-md": ["Inter"]
                    },
                    "fontSize": {
                        "headline-md": ["16px", { "lineHeight": "24px", "fontWeight": "600" }],
                        "code-sm": ["12px", { "lineHeight": "18px", "fontWeight": "400" }],
                        "headline-lg": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                        "label-sm": ["12px", { "lineHeight": "18px", "fontWeight": "400" }],
                        "body-md": ["14px", { "lineHeight": "22px", "fontWeight": "400" }]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-background text-text-primary h-full font-body-md flex antialiased selection:bg-primary selection:text-on-primary">
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 bottom-0 flex flex-col bg-background w-sidebar-width h-screen border-r border-border z-40 hidden md:flex">
<div class="p-6 flex items-center gap-3">
<div class="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary">
<span class="material-symbols-outlined text-[20px]" data-icon="auto_awesome">auto_awesome</span>
</div>
<div>
<h1 class="font-headline-md text-headline-md text-primary tracking-tight">DocLab</h1>
<p class="font-label-sm text-label-sm text-text-muted">Healthcare ML</p>
</div>
</div>
<div class="px-4 mb-6">
<button class="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-headline-md text-headline-md py-2.5 hover:bg-opacity-90 transition-opacity rounded-full">
<span class="material-symbols-outlined" data-icon="add">add</span>
                New Prototype
            </button>
</div>
<nav class="flex-1 px-3 space-y-1 overflow-y-auto">
<a class="flex items-center gap-3 px-3 py-2 text-primary font-bold bg-surface-container transition-colors rounded-full" href="#">
<span class="material-symbols-outlined" data-icon="add_box" data-weight="fill" style="font-variation-settings: 'FILL' 1;">add_box</span>
<span class="font-body-md text-body-md">New Prototype</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-text-muted hover:bg-surface-container transition-colors cursor-pointer active:scale-95 transition-transform duration-200 rounded-full" href="#">
<span class="material-symbols-outlined" data-icon="science">science</span>
<span class="font-body-md text-body-md">Experiments</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-text-muted hover:bg-surface-container transition-colors cursor-pointer active:scale-95 transition-transform duration-200 rounded-full" href="#">
<span class="material-symbols-outlined" data-icon="database">database</span>
<span class="font-body-md text-body-md">Datasets</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-text-muted hover:bg-surface-container transition-colors cursor-pointer active:scale-95 transition-transform duration-200 rounded-full" href="#">
<span class="material-symbols-outlined" data-icon="model_training">model_training</span>
<span class="font-body-md text-body-md">Models</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-text-muted hover:bg-surface-container transition-colors cursor-pointer active:scale-95 transition-transform duration-200 rounded-full" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-body-md text-body-md">Settings</span>
</a>
</nav>
<div class="p-3 border-t border-border mt-auto">
<a class="flex items-center gap-3 px-3 py-2 text-text-muted hover:bg-surface-container transition-colors rounded-full" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="description">description</span>
<span class="font-label-sm text-label-sm">Documentation</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-text-muted hover:bg-surface-container transition-colors rounded-full" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="help">help</span>
<span class="font-label-sm text-label-sm">Support</span>
</a>
</div>
</aside>
<!-- Main Content Area -->
<div class="flex-1 flex flex-col md:ml-[220px] min-h-screen">
<!-- TopAppBar -->
<header class="sticky top-0 z-30 flex justify-between items-center px-page-padding h-16 w-full bg-surface border-b border-border">
<div class="flex items-center gap-4">
<!-- Mobile Menu Toggle -->
<button class="md:hidden text-text-secondary hover:text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="menu">menu</span>
</button>
<div class="relative hidden sm:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled text-[20px]" data-icon="search">search</span>
<input class="w-64 pl-10 pr-4 py-1.5 bg-background border border-border rounded text-body-md font-body-md focus:outline-none focus:border-outline focus:ring-0 transition-colors placeholder:text-text-disabled" placeholder="Search resources..." type="text">
</div>
</div>
<div class="flex items-center gap-4">
<button class="flex items-center gap-2 px-4 py-1.5 bg-background border border-border rounded hover:bg-surface-muted transition-colors text-text-primary font-headline-md text-headline-md">
<span class="material-symbols-outlined text-[18px]" data-icon="rocket_launch">rocket_launch</span>
                    Deploy Model
                </button>
<button class="text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button class="text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</header>
<!-- Workspace Canvas -->
<main class="flex-1 px-page-padding py-12 flex flex-col items-center justify-center">
<div class="w-full max-w-[720px] mx-auto animate-fade-in-up">
<h2 class="font-headline-lg text-headline-lg text-primary mb-6 text-center tracking-tight">What healthcare AI model do you want to prototype?</h2>
<!-- Main Input Area -->
<div class="bg-surface rounded-xl border border-border p-1 focus-within:border-outline focus-within:ring-1 focus-within:ring-outline transition-all duration-300 relative bg-white shadow-sm">
<textarea class="w-full h-[160px] p-4 bg-transparent border-none resize-none font-body-md text-body-md text-text-primary placeholder:text-text-disabled focus:ring-0" placeholder="I want to predict hospital readmission risk from patient-style tabular data..." spellcheck="false"></textarea>
<div class="absolute bottom-4 right-4 flex items-center gap-3">
<div class="flex items-center gap-2 text-text-muted font-label-sm text-label-sm pr-4 border-r border-border">
<span class="material-symbols-outlined text-[16px]" data-icon="attach_file">attach_file</span>
                            Attach Dataset
                        </div>
<button class="bg-primary text-on-primary px-5 py-2 rounded flex items-center gap-2 font-headline-md text-headline-md hover:bg-opacity-90 transition-all transform active:scale-95">
                            Start Prototype
                            <span class="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
<!-- Example Prompts -->
<div class="mt-8">
<p class="font-label-sm text-label-sm text-text-muted mb-4 uppercase tracking-wider text-center">Example Scenarios</p>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
<button class="p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left group">
<div class="flex items-start gap-3">
<span class="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors" data-icon="analytics">analytics</span>
<div>
<h3 class="font-headline-md text-headline-md text-text-primary mb-1">Predict readmission risk</h3>
<p class="font-label-sm text-label-sm text-text-muted">Using EHR tabular data and historical patient flows.</p>
</div>
</div>
</button>
<button class="p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left group">
<div class="flex items-start gap-3">
<span class="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors" data-icon="medical_information">medical_information</span>
<div>
<h3 class="font-headline-md text-headline-md text-text-primary mb-1">Classify medical images</h3>
<p class="font-label-sm text-label-sm text-text-muted">Identify anomalies in chest X-rays using CNN architectures.</p>
</div>
</div>
</button>
<button class="p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left group">
<div class="flex items-start gap-3">
<span class="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors" data-icon="summarize">summarize</span>
<div>
<h3 class="font-headline-md text-headline-md text-text-primary mb-1">Summarize medical education text</h3>
<p class="font-label-sm text-label-sm text-text-muted">Extract key insights from unstructured clinical notes.</p>
</div>
</div>
</button>
<button class="p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left group">
<div class="flex items-start gap-3">
<span class="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors" data-icon="monitor_heart">monitor_heart</span>
<div>
<h3 class="font-headline-md text-headline-md text-text-primary mb-1">Detect patterns in ECG data</h3>
<p class="font-label-sm text-label-sm text-text-muted">Time-series analysis for early arrhythmia detection.</p>
</div>
</div>
</button>
</div>
</div>
</div>
</main>
</div>
<style>
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
    </style>


</body></html>

<!-- DocLab: Results with Performance Analysis -->
<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>DocLab - Results and Model Card</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&amp;family=JetBrains+Mono:wght@400&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "secondary-container": "#dfe0e0",
                        "surface-container-high": "#ebe7e6",
                        "inverse-surface": "#313030",
                        "error-container": "#ffdad6",
                        "surface-tint": "#5f5e5e",
                        "background": "#fafafa",
                        "outline-variant": "#c4c7c7",
                        "secondary-fixed": "#e2e2e2",
                        "tertiary-fixed": "#e6e2df",
                        "on-tertiary-container": "#868382",
                        "text-primary": "#171717",
                        "on-primary-container": "#858383",
                        "on-tertiary-fixed": "#1c1b1a",
                        "log-bg": "#0a0a0a",
                        "on-secondary-fixed-variant": "#454747",
                        "error": "#ba1a1a",
                        "on-primary-fixed-variant": "#474746",
                        "on-error": "#ffffff",
                        "surface-container-low": "#f7f3f2",
                        "success-bg": "#f0fdf4",
                        "surface-container": "#f1edec",
                        "on-secondary": "#ffffff",
                        "surface-bright": "#fdf8f8",
                        "warning-text": "#92400e",
                        "on-surface-variant": "#444748",
                        "inverse-primary": "#c8c6c5",
                        "tertiary": "#000000",
                        "on-error-container": "#93000a",
                        "log-text": "#e5e5e5",
                        "surface-variant": "#e5e2e1",
                        "primary": "#000000",
                        "on-secondary-fixed": "#1a1c1c",
                        "on-background": "#1c1b1b",
                        "surface": "#fdf8f8",
                        "text-secondary": "#525252",
                        "on-tertiary-fixed-variant": "#484645",
                        "error-bg": "#fef2f2",
                        "warning-bg": "#fffbeb",
                        "surface-dim": "#ddd9d8",
                        "surface-container-lowest": "#ffffff",
                        "tertiary-container": "#1c1b1a",
                        "text-disabled": "#a3a3a3",
                        "on-primary-fixed": "#1c1b1b",
                        "on-primary": "#ffffff",
                        "outline": "#747878",
                        "border-strong": "#d4d4d4",
                        "primary-fixed-dim": "#c8c6c5",
                        "primary-fixed": "#e5e2e1",
                        "success-text": "#166534",
                        "surface-muted": "#f5f5f5",
                        "tertiary-fixed-dim": "#cac6c4",
                        "secondary-fixed-dim": "#c6c6c7",
                        "surface-container-highest": "#e5e2e1",
                        "border": "#e5e5e5",
                        "text-muted": "#737373",
                        "on-tertiary": "#ffffff",
                        "error-text": "#991b1b",
                        "secondary": "#5d5f5f",
                        "inverse-on-surface": "#f4f0ef",
                        "on-secondary-container": "#616363",
                        "on-surface": "#1c1b1b",
                        "primary-container": "#1c1b1b"
                    },
                    borderRadius: {
                        DEFAULT: "0.25rem",
                        lg: "0.5rem",
                        xl: "0.75rem",
                        full: "9999px"
                    },
                    spacing: {
                        "gap-md": "16px",
                        "page-padding": "32px",
                        "sidebar-width": "220px",
                        "max-content-width": "1080px",
                        "gap-lg": "24px"
                    },
                    fontFamily: {
                        "headline-md": ["Inter"],
                        "code-sm": ["JetBrains Mono"],
                        "headline-lg": ["Inter"],
                        "label-sm": ["Inter"],
                        "body-md": ["Inter"]
                    },
                    fontSize: {
                        "headline-md": ["16px", { lineHeight: "24px", fontWeight: "600" }],
                        "code-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
                        "headline-lg": ["24px", { lineHeight: "32px", fontWeight: "600" }],
                        "label-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
                        "body-md": ["14px", { lineHeight: "22px", fontWeight: "400" }]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-background text-text-primary font-body-md text-body-md min-h-screen flex">
<!-- SideNavBar -->
<nav class="bg-background dark:bg-background text-primary dark:text-on-background w-[220px] h-screen border-r border-border dark:border-outline fixed left-0 top-0 bottom-0 flex flex-col z-50">
<div class="p-4 border-b border-border dark:border-outline flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center border border-border">
<span class="material-symbols-outlined text-text-secondary" style="font-variation-settings: 'FILL' 1;">dataset</span>
</div>
<div>
<h1 class="font-headline-md text-headline-md text-primary dark:text-on-background">DocLab</h1>
<p class="font-label-sm text-label-sm text-text-muted">Healthcare ML</p>
</div>
</div>
<div class="p-4">
<button class="w-full bg-primary text-on-primary font-headline-md text-headline-md py-2 px-4 flex items-center justify-center gap-2 hover:bg-inverse-surface transition-colors rounded-full">
<span class="material-symbols-outlined">add</span>
                New Prototype
            </button>
</div>
<ul class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
<li class="">
<a class="flex items-center gap-3 px-3 py-2 text-primary dark:text-on-background font-bold border-r-2 border-primary hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 rounded-full" href="#">
<span class="material-symbols-outlined">add_box</span>
                    New Prototype
                </a>
</li>
<li class="">
<a class="flex items-center gap-3 px-3 py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 rounded-full" href="#">
<span class="material-symbols-outlined">science</span>
                    Experiments
                </a>
</li>
<li class="">
<a class="flex items-center gap-3 px-3 py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 rounded-full" href="#">
<span class="material-symbols-outlined">database</span>
                    Datasets
                </a>
</li>
<li class="">
<a class="flex items-center gap-3 px-3 py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 rounded-full" href="#">
<span class="material-symbols-outlined">model_training</span>
                    Models
                </a>
</li>
<li class="">
<a class="flex items-center gap-3 px-3 py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 rounded-full" href="#">
<span class="material-symbols-outlined">settings</span>
                    Settings
                </a>
</li>
</ul>
<div class="p-2 border-t border-border dark:border-outline space-y-1">
<a class="flex items-center gap-3 px-3 py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 rounded-full" href="#">
<span class="material-symbols-outlined">description</span>
                Documentation
            </a>
<a class="flex items-center gap-3 px-3 py-2 text-text-muted dark:text-text-disabled hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 rounded-full" href="#">
<span class="material-symbols-outlined">help</span>
                Support
            </a>
</div>
</nav>
<!-- Main Wrapper -->
<div class="ml-[220px] flex-1 flex flex-col w-full bg-background min-h-screen">
<!-- TopAppBar -->
<header class="sticky top-0 z-40 bg-surface dark:bg-surface border-b border-border dark:border-outline h-16 w-full flex justify-between items-center px-page-padding max-w-[1080px] mx-auto" style="max-width: 1000px;">
<div class="flex items-center gap-4">
<div class="relative text-text-secondary dark:text-text-disabled">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2">search</span>
<input class="pl-10 pr-4 py-1.5 bg-surface-muted border border-border rounded-lg text-body-md font-body-md focus:outline-none focus:border-border-strong w-64 placeholder:text-text-disabled text-text-primary" placeholder="Search resources..." type="text">
</div>
</div>
<div class="flex items-center gap-4">
<button class="text-text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-muted">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-muted">
<span class="material-symbols-outlined">account_circle</span>
</button>
<button class="bg-primary text-on-primary font-headline-md text-headline-md py-1.5 px-4 rounded ml-2 hover:bg-inverse-surface transition-colors">
                    Deploy Model
                </button>
</div>
</header>
<!-- Main Content Canvas -->
<main class="flex-1 max-w-[1080px] w-full mx-auto pb-24 px-8 py-6" style="max-width: 1000px;">
<!-- Header Section -->
<div class="flex justify-between items-end mb-6">
<div>
<div class="flex items-center gap-2 mb-2">
<span class="bg-success-bg text-success-text px-2 py-0.5 rounded font-label-sm text-label-sm border border-success-text/20">Complete</span>
<span class="text-text-muted font-label-sm text-label-sm flex items-center gap-1">
<span class="material-symbols-outlined" style="font-size: 14px;">schedule</span>
                            14 mins ago
                        </span>
</div>
<h2 class="font-headline-lg text-headline-lg text-text-primary">Prototype Complete</h2>
<p class="text-text-secondary mt-1">Model training and evaluation finished successfully.</p>
</div>
<div class="flex gap-3">
<button class="bg-surface text-text-primary border border-border-strong font-headline-md text-headline-md py-2 px-4 rounded hover:bg-surface-muted transition-colors">
                        View Experiment Details
                    </button>
<button class="bg-primary text-on-primary font-headline-md text-headline-md py-2 px-4 rounded hover:bg-inverse-surface transition-colors shadow-sm">
                        View Model Card
                    </button>
</div>
</div>
<!-- Summary Cards (Bento Grid Style) -->
<div class="flex flex-wrap gap-x-12 gap-y-4 mb-8 pb-6 border-b border-border">
<div class="flex flex-col gap-0.5"><div class="text-text-muted font-label-sm text-label-sm uppercase tracking-wider">Model Type</div><div class="font-headline-md text-headline-md text-text-primary">XGBoost classifier</div></div>
<div class="flex flex-col gap-0.5"><div class="text-text-muted font-label-sm text-label-sm uppercase tracking-wider">Accuracy</div><div class="font-headline-md text-headline-md text-text-primary flex items-baseline gap-2">83% <span class="text-success-text font-label-sm">+2% vs baseline</span></div></div>
<div class="flex flex-col gap-0.5"><div class="text-text-muted font-label-sm text-label-sm uppercase tracking-wider">Status</div><div class="font-headline-md text-headline-md text-text-primary flex items-center gap-1.5">Saved <span class="material-symbols-outlined text-success-text" style="font-size: 18px;">check_circle</span></div></div>
<div class="flex flex-col gap-0.5"><div class="text-text-muted font-label-sm text-label-sm uppercase tracking-wider">Experiment ID</div><div class="font-code-sm text-code-sm text-text-primary">EXP-0042</div></div>
</div>
<!-- Model Card Comprehensive Panel -->
<div class="border border-border rounded-xl overflow-hidden">
<div class="border-b border-border flex justify-between items-center px-5 py-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-text-secondary">article</span><h3 class="font-headline-lg text-headline-lg text-text-primary">Model Card</h3></div><button class="text-text-muted hover:text-primary transition-colors flex items-center gap-1 font-label-sm underline underline-offset-4"><span class="material-symbols-outlined" style="font-size: 16px;">download</span> Export PDF</button></div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 p-6 gap-y-8">
<!-- Left Column (Metadata & Details) -->
<div class="col-span-1 pr-8 border-r border-border space-y-6">
<div>
<h4 class="font-headline-md text-headline-md text-text-secondary mb-2">Model Name</h4>
<p class="text-text-primary">CardioPredict-XG-v1</p>
</div>
<div>
<h4 class="font-headline-md text-headline-md text-text-secondary mb-2">Model Type</h4>
<p class="text-text-primary">XGBoost Classifier (Gradient Boosting)</p>
</div>
<div>
<h4 class="font-headline-md text-headline-md text-text-secondary mb-2">Dataset Summary</h4>
<p class="text-text-primary mb-2">MIMIC-IV Clinical Database subset.</p>
<ul class="text-text-muted font-label-sm text-label-sm space-y-1 border-l-2 border-border-strong pl-3">
<li class="">Records: 45,210</li>
<li class="">Features: 128 (Demographics, Vitals, Labs)</li>
<li class="">Split: 70% Train, 15% Val, 15% Test</li>
</ul>
</div>
<div>
<h4 class="font-headline-md text-headline-md text-text-secondary mb-2">Reproducibility</h4>
<div class="bg-log-bg text-log-text font-code-sm text-code-sm p-3 rounded-lg overflow-x-auto border border-outline-variant">
<code>seed = 42</code><br>
<code>learning_rate = 0.05</code><br>
<code>max_depth = 6</code><br>
<code>n_estimators = 200</code>
</div>
</div>
</div>
<!-- Right Columns (Narrative & Metrics) -->
<div class="col-span-2 space-y-6">
<div class="grid grid-cols-2 gap-8">
<div>
<h4 class="font-headline-md text-headline-md text-text-secondary mb-2">Goal</h4>
<p class="text-text-primary leading-relaxed">Predict the likelihood of a cardiovascular event within 30 days post-discharge based on clinical indicators during the ICU stay.</p>
</div>
<div>
<h4 class="font-headline-md text-headline-md text-text-secondary mb-2">Intended Use</h4>
<p class="text-text-primary leading-relaxed">Clinical decision support tool for attending physicians to flag high-risk patients for follow-up scheduling. Not for automated diagnosis.</p>
</div>
</div>
<div class="border-t border-border pt-6">
<h4 class="font-headline-md text-headline-md text-text-secondary mb-4">Metrics &amp; Results</h4>
<div class="border border-border rounded-lg overflow-hidden"><table class="w-full text-left"><thead class="border-b border-border"><tr class="text-text-muted font-label-sm uppercase tracking-wider"><th class="py-3 px-0 font-semibold">Metric</th><th class="py-3 px-4 font-semibold text-right">Validation</th><th class="py-3 px-0 font-semibold text-right">Test Set</th></tr></thead><tbody class="divide-y divide-border/40"><tr class="text-body-md"><td class="py-4 px-0 text-text-secondary">Accuracy</td><td class="py-4 px-4 text-right">84.2%</td><td class="py-4 px-0 text-right font-semibold">83.1%</td></tr><tr class="text-body-md"><td class="py-4 px-0 text-text-secondary">Precision</td><td class="py-4 px-4 text-right">78.5%</td><td class="py-4 px-0 text-right">77.8%</td></tr><tr class="text-body-md"><td class="py-4 px-0 text-text-secondary">Recall (Sensitivity)</td><td class="py-4 px-4 text-right">81.0%</td><td class="py-4 px-0 text-right">80.2%</td></tr><tr class="text-body-md"><td class="py-4 px-0 text-text-secondary">AUC-ROC</td><td class="py-4 px-4 text-right">0.89</td><td class="py-4 px-0 text-right font-semibold">0.88</td></tr></tbody></table></div>
</div>
<div class="border-t border-border pt-6">
<h4 class="font-headline-md text-headline-md text-text-secondary mb-4">Performance Analysis</h4>
<div class="grid grid-cols-2 gap-6">
<div class="border border-border bg-surface-container-lowest p-4 rounded-lg flex flex-col">
<div class="flex justify-between items-center mb-3">
<span class="font-headline-md text-headline-md text-text-primary">Model Convergence</span>
<span class="font-code-sm text-code-sm text-text-muted bg-surface-muted px-2 py-0.5 rounded border border-border">loss_curve</span>
</div>
<div class="flex-1 rounded border border-border overflow-hidden bg-white">
<img alt="Model Convergence" class="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsLcAoiZQ9nK8ZdHMS3LuQ58n3cRtACmDpIaGeKdoKqBmo9jNESnKZyAFoJPDTxKs2l0Y67wObL0O9c_qZ0v44pRWZ13p-P-IfcUa6uJ6O82JzNpa_vi0FT1U6cryIQFSaiOnGbyYrbUJfEAh_wu6TSjfwgDNiAGX5IeZeevGt3_dnkzus_jQ_Ci1t3k5UipqyyaJdnn5Ly1OaJS5Q1d1zH5a8d3P5TTfzLAv7smODNbJH3FPjM_xurmxKT7RQQmM0NjGQ98mrCF0">
</div>
</div>
<div class="border border-border bg-surface-container-lowest p-4 rounded-lg flex flex-col">
<div class="flex justify-between items-center mb-3">
<span class="font-headline-md text-headline-md text-text-primary">PR Curve</span>
<span class="font-code-sm text-code-sm text-text-muted bg-surface-muted px-2 py-0.5 rounded border border-border">pr_curve</span>
</div>
<div class="flex-1 rounded border border-border overflow-hidden bg-white">
<img alt="PR Curve" class="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4rfxlpiKv6No8l7X5q4Y4ex6-r2Ho3sFC74hX_rwC6OHarN7jgRvJrOA_VRQl9-672UkjzQMCCysJM7ZulkrPdjtmta4Q364E_S2UsZqfUSuzkyxOlbbUHKglycswKzgxHLgF0Hhg07sNVAnT4LZ8GhkgDzAFHmDPyTVEUHdONd0AjSBoYjl6wZAC6pCf5uuFV8AQEcTF3VVlEknONi1cLYQhYS4sQ59JGPBzR6MIRMd_-PjD5-gDQsQeYdMywRYzsb9ZEAwGgHY">
</div>
</div>
</div>
</div>
<div class="grid grid-cols-2 gap-8 border-t border-border pt-6"><div><h4 class="font-headline-md text-headline-md text-text-primary flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-warning-text" style="font-size: 20px;">warning</span> Limitations</h4><ul class="space-y-3 text-text-secondary"><li class="flex gap-2"><span class="text-border-strong">•</span> Performance drops significantly for patients under 30 years old due to underrepresentation in training data.</li><li class="flex gap-2"><span class="text-border-strong">•</span> Requires complete lab panels; handles missing data via mean imputation which may skew edge cases.</li></ul></div><div><h4 class="font-headline-md text-headline-md text-text-primary flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-error" style="font-size: 20px;">gpp_bad</span> Risks</h4><ul class="space-y-3 text-text-secondary"><li class="flex gap-2"><span class="text-border-strong">•</span> False positives may lead to unnecessary patient anxiety and resource strain.</li><li class="flex gap-2"><span class="text-border-strong">•</span> Potential demographic bias observed in recall rates across different socioeconomic backgrounds.</li></ul></div></div>
</div>
</div>
</div>
</main>
</div>


</body></html>