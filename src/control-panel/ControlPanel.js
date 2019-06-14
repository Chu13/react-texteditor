import React, { Component } from 'react';
import './ControlPanel.css';

class ControlPanel extends Component {
    render() {
        return (
            <div id="control-panel">
                <div id="format-actions">
                    <button className="format-action first" type="button" onClick={(e) => this.props.makeAction(e, 'bold')}><b>B</b></button>
                    <button className="format-action" type="button" onClick={(e) => this.props.makeAction(e, 'italic')}><i>I</i></button>
                    <button className="format-action" type="button" onClick={(e) => this.props.makeAction(e, 'underline')}><u>U</u></button>
                    <button className="format-action" type="button" onClick={(e) => this.props.searchSyn()}>Syn</button>
                </div>
            </div>
        );
    }
}

export default ControlPanel;
