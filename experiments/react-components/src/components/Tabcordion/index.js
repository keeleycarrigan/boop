import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    find,
    get,
    merge,
} from 'lodash';

import { convertKeyCode } from '../../utilities';

export class Tab extends Component {
    tabClick = (e) => {
        e.preventDefault();
        const {
            id,
            onClick,
        } = this.props;

        onClick && onClick(id, e);
    }
    keyPress = (e) => {
        const {
            id,
            onKeyDown,
            prevTabID,
            nextTabID,
        } = this.props;
        const {
            isLeftDir,
            isRightDir,
            isUpDir,
            isDownDir,
        } = convertKeyCode(e);
        let tabID = null;

        if (isLeftDir || isUpDir) {
            tabID = prevTabID;
            console.log(tabID)
        } else if (isRightDir || isDownDir) {
            tabID = nextTabID;
        }

        (tabID && onKeyDown) && onKeyDown(tabID, e);
    }

    render() {
        return (
            <a
                href="#"
                onClick={this.tabClick}
                onKeyDown={this.keyPress}
                id={`${this.props.id}-label`}
                className={`basic-tabcordion-trigger ${this.props.selected ? 'active-item': ''}`}
                aria-controls={`${this.props.id}-panel`}
                aria-expanded={this.props.selected}
                aria-selected={this.props.selected}
                data-tabcordion-trigger={`${this.props.id}-panel`}
                role="tab">
                {this.props.children}
            </a>
        )
    }
}


export class TabPanel extends Component {
    render() {
        return (
            <div
                id={`${this.props.id}-panel`}
                className={`basic-tabcordion-content ${this.props.selected ? 'active-item': ''}`}
                aria-hidden={!this.props.selected}
                data-tabcordion-panel={`${this.props.id}-panel`}
                role="tabpanel">
                {this.props.children}
            </div>
        )
    }
}

export default class Tabcordion extends Component {
    constructor(props) {
        super(props);

        this.tabRefs = {};
        this.tabElements = this.filterTabRoles(props.children);
        this.state = {
            active: props.initialTab || this.tabElements.triggers[0].props.id
        }
    }

    setSelected(tabElements) {
        return React.Children.map(tabElements, (child, idx,) => {
            const newProps = {
                selected: child.props.id === get(this, 'state.active'),
                ref: (el) => this.tabRefs[`${child.type.name}-${child.props.id}`] = el
            };
            if (child.type.name === 'Tab') {
                let nextTabIdx = idx + 1;
                let prevTabIdx = idx - 1;
                if (nextTabIdx > tabElements.length - 1) {
                    nextTabIdx = 0;
                }
                if (prevTabIdx < 0) {
                    prevTabIdx = tabElements.length - 1;
                }
                
                newProps.onClick = this.onTabClick;
                newProps.onKeyDown = this.onTabPress;
                newProps.nextTabID = get(tabElements, `[${nextTabIdx}].props.id`);
                newProps.prevTabID = get(tabElements, `[${prevTabIdx}].props.id`);
            }

            const element = React.cloneElement(child, merge({}, child.props, newProps))

            return element
        })
    }

    filterTabRoles(children) {
        const childArray = React.Children.toArray(children);
        return {
            triggers: this.setSelected(childArray.filter((child) => child.type.name === 'Tab')),
            panels: this.setSelected(childArray.filter((child) => child.type.name === 'TabPanel')),
        }
    }

    getTabData(children) {
        const { triggers, panels } = this.filterTabRoles(children);
        const panelWrapper = React.createElement('div', {key: 'panel-holder', className: 'basic-tabcordion-panels', 'data-tabcordion-panel-holder': ''}, panels);

        return [ ...triggers, panelWrapper ];
    }

    getAccordionData(children) {
        const { triggers, panels } = this.filterTabRoles(children);

        return triggers.reduce((acordionItems, trigger) => {
            const id = trigger.props.id;
            const matchingPanel = find(panels, [ 'props.id', id ])

            if (matchingPanel) {
                acordionItems = [ ...acordionItems, trigger, matchingPanel ];
            }

            return acordionItems;
        }, []);
    }

    onTabClick = (tabID, e) => {
        // console.log(tabID)
        this.setState({ active: tabID });
    }

    onTabPress = (tabID, e) => {
        console.log()
        ReactDOM.findDOMNode(this.tabRefs[`Tab-${tabID}`]).focus()
        this.setState({ active: tabID });
    }

    render() {
        console.log(this.tabRefs)
        return (
            <div className="basic-tabcordion" role="tablist">
                {this.getTabData(this.props.children)}
            </div>
        )
    }
}