export let Menu = [
    {label: 'Angular', icon: 'pi pi-fw pi-home', routerLink: ['/']},
    {label: 'Some Menu', icon: 'pi pi-fw pi-copy', routerLink: ['/project']},    
    {label: 'Setting', icon: 'pi pi-fw pi-wrench', routerLink: ['/setting'], perm:['Admin'],
        items: [
            {label: 'User Registration', icon: 'pi pi-fw pi-id-card', routerLink: ['/newuser']},
            {label: 'User Management', icon: 'pi pi-fw pi-check-square', routerLink: ['/users']},
        ]
    }
];