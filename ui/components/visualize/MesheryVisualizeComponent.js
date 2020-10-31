import React from 'react';
import NoSsr from '@material-ui/core/NoSsr';
import CytoscapeComponent from 'react-cytoscapejs';
import GraphStyle from './styles/styleContainer';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { withStyles } from '@material-ui/core/styles';
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import popper from 'cytoscape-popper';
import ReactDOM from 'react-dom';
import Drawer from './Drawer'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import elementsJson from './Elements';
import dagre from 'cytoscape-dagre';
import clsx from 'clsx';
import {
  TopologyIcon
} from '@patternfly/react-icons';
import { Paper } from '@material-ui/core';
import logsJson from './logs';
import MiniDrawer from './MiniDrawer';

cytoscape.use(dagre)
cytoscape.use(popper)
cytoscape.use(cxtmenu)

const DummyTooltip = (props) => {
  return <p>{props.data.data('app')}</p>;
};

const removeTooltip = () => {
  var el = document.getElementById('ccfc');
  if (el) {
    el.remove();
  }
}

const createContentFromComponent = (component) => {
  removeTooltip();
  var dummyDomEle = document.createElement('div');
  dummyDomEle.id = 'ccfc';
  ReactDOM.render(component, dummyDomEle);
  document.body.appendChild(dummyDomEle);
  return dummyDomEle;
};

const formalities = () => {
  var el = document.getElementById('edc');
  if (el) {
    el.remove();
  }
  el = document.getElementById('ndc');
  if (el) {
    el.remove();
  }
}

const style = (theme) => ({

  zoomButton: {
    position: 'absolute',
    top: 'auto',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    right: 'auto'
  },

  layoutButton: {
    position: 'absolute',
    top: 'auto',
    bottom: theme.spacing(2),
    left: '45%',
    right: '55%',
  },

  saveButton: {
    position: 'absolute',
    top: 'auto',
    bottom: theme.spacing(2),
    left: 'auto',
    right: theme.spacing(2),
  },

  div: {
    width: '100%',
    height: '100%',
    borderRadius: '5px',
    background: '#fff',
  },

  wrapper: {
    position: 'relative',
    width: '95%',
    height: '80%',
  },

  wrapper2: {
    position: 'relative',
    width: '70%',
    height: '80%',
  },

  logsContainer: {
    marginTop: '20px',
  },

  logs: {
    width: '100%',
    minHeight: '13vh',
    overflow: 'auto',
    resize: 'vertical',
    color: '#fff',
    backgroundColor: '#253137'
  }
});

class MesheryVisualizeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.cyPopperRef = React.createRef();
    this.state = {
      layout: 'cose',
      open: false,
      data: null,
      tab: 0,
      logs: [],
      showDialog: false
    }
    this.prev = null;
  }

  toggleChildMenu(data, val) {
    if(!val) this.prev = null;
    this.setState({open: val, data: data});
  }

  toggleMiniDrawer(tab){
    this.setState({open: true, tab: tab});
  }

  zoomIn() {
    this.cy.zoom(0.5 + this.cy.zoom())
    if (this.cy.$(':selected').size())
      this.cy.center(this.cy.$(':selected'))
    else
      this.cy.center()
  }

  zoomOut() {
    this.cy.zoom(-0.5 + this.cy.zoom())
    if (this.cy.$(':selected').size())
      this.cy.center(this.cy.$(':selected'))
    else
      this.cy.center()
  }

  fit() {
    this.cy.fit()
  }

  saveGraph() {
    let image = this.cy.png()
    var lnk = document.createElement('a'), date = new Date(), e
    lnk.href = image
    lnk.download = 'MeshMap - ' + date.toDateString() + '/' + date.toLocaleTimeString() + '.png'

    if (document.createEvent) {
      e = document.createEvent("MouseEvents");
      e.initMouseEvent("click", true, true, window,
        0, 0, 0, 0, 0, false, false, false,
        false, 0, null);

      lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
      lnk.fireEvent("onclick");
    }

  }

  handleLayoutChange = (e, value) => {
    if (value) {
      var layout = this.cy.layout({
        name: value
      });
      layout.run();
      this.setState({ layout: value });
    }
  }

  componentDidMount() {
    this.setState({logs: logsJson.logs.join('\n')});
  }

  render() {
    const { classes } = this.props
    const { layout, open, data, logs, tab } = this.state;
    //Checkout the docs for JSON format https://js.cytoscape.org/#notation/elements-json
    const elements = elementsJson.elements;

    let cxtMenuSettings = {
      menuRadius: 100, // the radius of the circular menu in pixels
      selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
      commands: [ // an array of commands to list in the menu or a function that returns the array
        {
          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
          content: 'perf', // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: function () { // a function to execute when the command is selected
            this.setState({showDialog: true}) // `ele` holds the reference to the active element
          },
          enabled: true // whether the command is selectable
        },
        {
          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
          content: 'cmd2', // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: function (ele) { // a function to execute when the command is selected
            console.log(ele.id()) // `ele` holds the reference to the active element
          },
          enabled: true // whether the command is selectable
        },
        {
          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
          content: 'cmd3', // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: function (ele) { // a function to execute when the command is selected
            console.log(ele.id()) // `ele` holds the reference to the active element
          },
          enabled: true // whether the command is selectable
        }
      ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
      fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
      activeFillColor: 'rgba(1, 105, 217, 0.75)', // the colour used to indicate the selected command
      activePadding: 20, // additional size in pixels for the active command
      indicatorSize: 24, // the size in pixels of the pointer to the active command
      separatorWidth: 3, // the empty spacing in pixels between successive commands
      spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
      minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
      maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
      openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
      itemColor: 'white', // the colour of text in the command's content
      itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
      zIndex: 9999, // the z-index of the ui div
      atMouse: false // draw menu at mouse position
    };
    

    return (
      <NoSsr>
        <Dialog
          open={this.state.showDialog}
          onClose={() => this.setState({showDialog: false})}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending anonymous location data to
              Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({showDialog: false})} color="primary">
              Disagree
            </Button>
            <Button onClick={() => this.setState({showDialog: false})} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <MiniDrawer 
          toggle={(tab) => {
            this.toggleMiniDrawer(tab);
          }}
        />
        <div className={clsx({ [classes.wrapper]: !open }, {
          [classes.wrapper2]: open,
        })} >
          <div className={classes.div}>
            <CytoscapeComponent
              elements={CytoscapeComponent.normalizeElements(elements)}
              style={{ width: '100%', height: '100%' }}
              layout={GraphStyle.getLayout()}
              stylesheet={GraphStyle.getStylesheetContainer()}
              cy={cy => {
                this.cy = cy;
                this.cy.cxtmenu(cxtMenuSettings);
                this.cy.elements().on('mouseover', (event) => {
                  this.cyPopperRef.current = event.target.popper({
                    content: createContentFromComponent(<DummyTooltip data={event.target} />),
                    popper: {
                      placement: 'right',
                      removeOnDestroy: true,
                    },
                  });
                });
                this.cy.elements().on('mouseout', () => {
                  if (this.cyPopperRef) {
                    removeTooltip();
                  }
                });
                this.cy.elements().on('click', (event) => { 
                  var sel = event.target;
                  if(!this.prev){
                    this.prev = event.target;
                  } else {
                    if(event.target === this.prev) return;
                    else this.prev = event.target;
                  }
                  formalities();
                  this.toggleChildMenu(sel, true);
                  this.cy.startBatch();
                  {
                    this.cy.elements().removeClass('semitransp','highlight');
                    this.cy.elements().difference(sel.outgoers().union(sel.incomers())).not(sel).addClass('semitransp');
                    sel.addClass('highlight').outgoers().union(sel.incomers()).addClass('highlight');
                    this.cy.resize();
                    this.cy.animate({
                      fit: {
                        eles: sel.outgoers().union(sel.incomers()),
                        padding: 200
                      }
                    },
                    {
                      duration: 500
                    }
                    )
                  }
                  this.cy.endBatch();
                });
              }}
            />
          </div>
          {
            open && <Drawer data={data} open={open} tab={tab}
              toggle={(data, val) => {
                this.toggleChildMenu(data, val);
              }}
            />
          }
          <ButtonGroup className={classes.zoomButton} color="primary" aria-label="outlined primary button group">
            <Button onClick={this.zoomIn.bind(this)}>+</Button>
            <Button onClick={this.zoomOut.bind(this)}>-</Button>
            <Button onClick={this.fit.bind(this)}>fit</Button>
          </ButtonGroup>
          <ToggleButtonGroup
            value={layout}
            exclusive
            onChange={this.handleLayoutChange}
            className={classes.layoutButton}
            size="small"
          >
            <ToggleButton value="cose" >
              <TopologyIcon /> 1
            </ToggleButton>
            <ToggleButton value="breadthfirst" >
              <TopologyIcon /> 2
            </ToggleButton>
            <ToggleButton value="circle" >
              <TopologyIcon /> 3
            </ToggleButton>
            <ToggleButton value="dagre" >
              <TopologyIcon /> 4
            </ToggleButton>
            <ToggleButton value="concentric" >
              <TopologyIcon /> 5
            </ToggleButton>
          </ToggleButtonGroup>
          <ButtonGroup className={classes.saveButton} color="primary" aria-label="outlined primary button group">
            <Button id="download" onClick={this.saveGraph.bind(this)} style={{ textDecoration: 'none' }}>Save</Button>
          </ButtonGroup>
          <Paper className={classes.logsContainer}>
            <textarea className={classes.logs} readOnly={true} value={logs} />   
          </Paper>
        </div>
      </NoSsr>
    )
  }
}

export default withStyles(style)(MesheryVisualizeComponent);