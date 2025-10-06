
// TypeScript version, Bootstrap 5+, no jQuery, no lodash/classnames

export type BootstrapMenuAction = {
    name: string | ((data: any) => string);
    iconClass?: string;
    classNames?: string | ((data: any) => string);
    isShown?: (data: any) => boolean;
    isEnabled?: (data: any) => boolean;
    onClick: (data: any) => void;
};

export type BootstrapMenuOptions = {
    container?: HTMLElement | string;
    fetchElementData?: (el: HTMLElement) => any;
    menuSource?: 'mouse' | 'element';
    menuPosition?: 'aboveLeft' | 'aboveRight' | 'belowLeft' | 'belowRight';
    menuEvent?: 'click' | 'right-click' | 'hover';
    actionsGroups?: string[][];
    actions: Record<string, BootstrapMenuAction>;
    noActionsMessage?: string;
    _actionSelectEvent?: 'click' | 'mousedown';
};

const defaultOptions: BootstrapMenuOptions = {
    container: 'body',
    fetchElementData: () => undefined,
    menuSource: 'mouse',
    menuPosition: 'belowLeft',
    menuEvent: 'right-click',
    actionsGroups: [],
    actions: {},
    noActionsMessage: 'No available actions',
    _actionSelectEvent: 'click',
};

function uniqueId(prefix = ''): string {
    return prefix + Math.random().toString(36).substr(2, 9);
}

function renderMenu(menu: BootstrapMenu): HTMLElement {
    const menuDiv = document.createElement('div');
    menuDiv.className = 'dropdown bootstrapMenu';
    menuDiv.style.zIndex = '10000';
    menuDiv.style.position = 'absolute';
    menuDiv.style.display = 'none';

    const ul = document.createElement('ul');
    ul.className = 'dropdown-menu';
    ul.style.position = 'static';
    ul.style.display = 'block';
    ul.style.fontSize = '0.9em';

    // Group actions
    const groups: string[][] = [];
    groups[0] = [];
    menu.options.actionsGroups?.forEach((groupArr, ind) => {
        groups[ind + 1] = [];
    });

    let actionsHaveIcon = false;
    Object.entries(menu.options.actions).forEach(([actionId, action]) => {
        let addedToGroup = false;
        menu.options.actionsGroups?.forEach((groupArr, ind) => {
            if (groupArr.includes(actionId)) {
                groups[ind + 1]!.push(actionId);
                addedToGroup = true;
            }
        });
        if (!addedToGroup) groups[0]!.push(actionId);
        if (action.iconClass) actionsHaveIcon = true;
    });

    let isFirstNonEmptyGroup = true;
    groups.forEach((actionsIds) => {
        if (actionsIds.length === 0) return;
        if (!isFirstNonEmptyGroup) {
            const divider = document.createElement('li');
            divider.className = 'dropdown-divider';
            ul.appendChild(divider);
        }
        isFirstNonEmptyGroup = false;
        actionsIds.forEach((actionId) => {
            const action = menu.options.actions[actionId]!;
            const li = document.createElement('li');
            li.setAttribute('role', 'presentation');
            li.dataset.action = actionId;
            const a = document.createElement('a');
            a.setAttribute('role', 'menuitem');
            a.href = '#';
            if (actionsHaveIcon) {
                const i = document.createElement('i');
                i.className = `bi bi-${action.iconClass || ''}`;
                a.appendChild(i);
                a.appendChild(document.createTextNode(' '));
            }
            const span = document.createElement('span');
            span.className = 'actionName';
            a.appendChild(span);
            li.appendChild(a);
            ul.appendChild(li);
        });
        // No actions message
        const noActionsLi = document.createElement('li');
        noActionsLi.setAttribute('role', 'presentation');
        noActionsLi.className = 'noActionsMessage disabled';
        const noActionsA = document.createElement('a');
        noActionsA.setAttribute('role', 'menuitem');
        noActionsA.href = '#';
        const noActionsSpan = document.createElement('span');
        noActionsSpan.textContent = menu.options.noActionsMessage || '';
        noActionsA.appendChild(noActionsSpan);
        noActionsLi.appendChild(noActionsA);
        ul.appendChild(noActionsLi);
    });
    menuDiv.appendChild(ul);
    return menuDiv;
}

class BootstrapMenu {
    static existingInstances: BootstrapMenu[] = [];
    selector: string;
    options: BootstrapMenuOptions;
    namespace: string;
    closeNamespace: string;
    container!: HTMLElement;
    menu!: HTMLElement;
    menuList!: HTMLElement;
    openTarget: HTMLElement | null = null;
    openEvent: MouseEvent | null = null;

    constructor(selector: string, options: Partial<BootstrapMenuOptions>) {
        this.selector = selector;
        this.options = { ...defaultOptions, ...options };
        this.namespace = uniqueId('.BootstrapMenu_');
        this.closeNamespace = uniqueId('.BootstrapMenuClose_');
        this.init();
    }

    init() {
        this.container = typeof this.options.container === 'string'
            ? document.querySelector(this.options.container) as HTMLElement
            : this.options.container as HTMLElement;
        this.menu = renderMenu(this);
        this.menuList = this.menu.querySelector('ul')!;
        this.menu.style.display = 'none';
        this.container.appendChild(this.menu);
        this.openTarget = null;
        this.openEvent = null;
        this.setupOpenEventListeners();
        this.setupActionsEventListeners();
        BootstrapMenu.existingInstances.push(this);
    }

    setupOpenEventListeners() {
        let openEventName: string;
        switch (this.options.menuEvent) {
            case 'click': openEventName = 'click'; break;
            case 'right-click': openEventName = 'contextmenu'; break;
            case 'hover': openEventName = 'mouseenter'; break;
            default: throw new Error("Unknown BootstrapMenu 'menuEvent' option");
        }
        this.container.addEventListener(openEventName, (evt) => {
            const target = evt.target as HTMLElement;
            if (!target.matches(this.selector)) return;
            this.open(target, evt as MouseEvent);
            evt.preventDefault();
            evt.stopPropagation();
        });
    }

    clearOpenEventListeners() {
        // Not implemented: would require tracking listeners for removal
    }

    setupActionsEventListeners() {
        const eventType = this.options._actionSelectEvent || 'click';
        this.menu.addEventListener(eventType, (evt) => {
            const target = evt.target as HTMLElement;
            const actionLi = target.closest('[data-action]') as HTMLElement;
            if (!actionLi || actionLi.classList.contains('disabled')) return;
            const actionId = actionLi.dataset.action!;
            const data = this.options.fetchElementData?.(this.openTarget!);
            this.options.actions[actionId]!.onClick(data);
            this.close();
            evt.preventDefault();
            evt.stopPropagation();
        });
    }

    clearActionsEventListeners() {
        // Not implemented: would require tracking listeners for removal
    }

    setupCloseEventListeners() {
        if (this.options.menuEvent === 'hover') {
            const leaveHandler = (evt: MouseEvent) => {
                const dest = evt.relatedTarget as HTMLElement;
                if (dest !== this.openTarget && dest !== this.menu) {
                    this.menu.removeEventListener('mouseleave', leaveHandler);
                    this.openTarget?.removeEventListener('mouseleave', leaveHandler);
                    this.close();
                }
            };
            this.menu.addEventListener('mouseleave', leaveHandler);
            this.openTarget?.addEventListener('mouseleave', leaveHandler);
        }
        document.addEventListener('click', this._closeOnOutsideClick);
    }

    clearCloseEventListeners() {
        document.removeEventListener('click', this._closeOnOutsideClick);
    }

    _closeOnOutsideClick = (evt: MouseEvent) => {
        if (!this.menu.contains(evt.target as Node)) {
            this.close();
        }
    };

    updatePosition() {
        let x = 0, y = 0;
        if (this.options.menuSource === 'element' && this.openTarget) {
            const rect = this.openTarget.getBoundingClientRect();
            switch (this.options.menuPosition) {
                case 'belowRight':
                    x = rect.right;
                    y = rect.bottom;
                    break;
                case 'belowLeft':
                    x = rect.left;
                    y = rect.bottom;
                    break;
                case 'aboveRight':
                    x = rect.right;
                    y = rect.top - this.menu.offsetHeight;
                    break;
                case 'aboveLeft':
                    x = rect.left;
                    y = rect.top - this.menu.offsetHeight;
                    break;
                default:
                    throw new Error("Unknown BootstrapMenu 'menuPosition' option");
            }
        } else if (this.options.menuSource === 'mouse' && this.openEvent) {
            x = this.openEvent.clientX;
            y = this.openEvent.clientY;
        }
        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;
    }

    open(target: HTMLElement, event: MouseEvent) {
        BootstrapMenu.closeAll();
        this.openTarget = target;
        this.openEvent = event;
        const data = this.options.fetchElementData?.(this.openTarget);
        // Show/hide actions
        let numShown = 0;
        this.menu.querySelectorAll('[data-action]').forEach((li) => {
            const actionId = (li as HTMLElement).dataset.action!;
            const action = this.options.actions[actionId]!;
            let show = true;
            if (action.isShown && !action.isShown(data)) show = false;
            (li as HTMLElement).style.display = show ? '' : 'none';
            if (show) numShown++;
            // Set name
            const nameSpan = li.querySelector('.actionName') as HTMLElement;
            nameSpan.textContent = typeof action.name === 'function' ? action.name(data) : action.name;
            // Set enabled/disabled
            if (action.isEnabled && !action.isEnabled(data)) {
                li.classList.add('disabled');
            } else {
                li.classList.remove('disabled');
            }
            // Set custom classes
            if (action.classNames) {
                const classes = typeof action.classNames === 'function' ? action.classNames(data) : action.classNames;
                li.className = `${li.className} ${classes}`;
            }
        });
        // No actions message
        const noActionsMsg = this.menu.querySelector('.noActionsMessage') as HTMLElement;
        if (numShown === 0) {
            noActionsMsg.style.display = '';
        } else {
            noActionsMsg.style.display = 'none';
        }
        this.updatePosition();
        this.menu.style.display = 'block';
        this.setupCloseEventListeners();
    }

    close() {
        this.menu.style.display = 'none';
        this.clearCloseEventListeners();
    }

    destroy() {
        this.close();
        this.clearOpenEventListeners();
        this.clearActionsEventListeners();
        if (this.menu.parentNode) this.menu.parentNode.removeChild(this.menu);
    }

    static closeAll() {
        BootstrapMenu.existingInstances.forEach((menu) => menu.close());
    }
}

export default BootstrapMenu;