import React, { Component } from "react";
import ControlPanel from "../control-panel/ControlPanel";
import { Editor } from "slate-react";
import { Value } from "slate";
import "./FileZone.css";
import BoldTag from "../components/BoldTag";
import ItalicTag from "../components/ItalicTag";
import UnderlineTag from "../components/UnderlineTag";
import axios from "axios";

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text"
          }
        ]
      }
    ]
  }
});

class FileZone extends Component {
  state = {
    value: initialValue,
    boldButton: false,
    italicButton: false,
    underlineButton: false,
    synDisplay: false,
    synArray: []
  };

  ref = editor => {
    this.editor = editor;
  };

  onEvent = event => {
    console.log(event);
  };

  onChange = ({ value }) => {
    this.setState({ value, synDisplay: false });
  };

  renderTag = (props, editor, next) => {
    if (props.mark.type === "bold") {
      return <BoldTag {...props} />;
    } else if (props.mark.type === "italic") {
      return <ItalicTag {...props} />;
    } else if (props.mark.type === "underline") {
      return <UnderlineTag {...props} />;
    } else if (props.mark.type === "synonym") {
      console.log(...props);
    } else {
      return next();
    }
  };

  panelClick = (e, type) => {
    e.preventDefault();
    if (type === "bold") {
      this.editor.toggleMark("bold");
    } else if (type === "italic") {
      this.editor.toggleMark("italic");
    } else if (type === "underline") {
      this.editor.toggleMark("underline");
    } else {
      return
    }
  };

  toggleButton = type => {
    if (type === "bold") {
      this.setState({
        boldButton: !this.state.boldButton
      });
    } else if (type === "italic") {
      this.setState({
        italicButton: !this.state.italicButton
      });
    } else if (type === "underline") {
      this.setState({
        underlineButton: !this.state.underlineButton
      });
    }
  };

  searchSyn = () => {
    let word = this.state.value.focusText.text;
    axios.get(`https://api.datamuse.com/words?rel_syn=${word}&max=10`)
    .then(res => {
      let allwords = [];
      if(res.data.length > 0) {
        res.data.forEach(word => {
            allwords.push(word.word);
          });
      }
      console.log(allwords)
      this.setState({
        synArray: allwords,
        synDisplay: true
      })
      setTimeout(() => {this.setState({synDisplay: false, synArray: []});}, 15000)
    }).catch(err => {
        console.log(err)
    })
  };

  synClick = (word) => {
      this.editor.deleteWordBackward()
      this.editor.insertText(word)
  } 

  drawArray = () => {
    if (this.state.synDisplay) {
      let synArray = this.state.synArray;
      return synArray.map(word => {
        return <button key={word} onClick={() => this.synClick(word)}> {word} </button>;
      });
    } else {
      return;
    }
  };

  render() {
    return (
      <div id="file-zone">
        <div>{this.drawArray()}</div>
        <div id="panel">
          <ControlPanel
            makeAction={this.panelClick}
            underlineButton={this.state.underlineButton}
            boldButton={this.state.boldButton}
            italicButton={this.state.italicButton}
            searchSyn={this.searchSyn}
          />
        </div>
        <div id="file">
          <Editor
            placeholder="Enter some text..."
            value={this.state.value}
            onChange={this.onChange}
            renderMark={this.renderTag}
            ref={this.ref}
          />
        </div>
      </div>
    );
  }
}

export default FileZone;
