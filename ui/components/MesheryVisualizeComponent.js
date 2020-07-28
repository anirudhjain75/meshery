import React from 'react';
import { Button, Dialog, DialogTitle, Divider, Container, TextField, RadioGroup, FormControlLabel, Radio, Grid } from '@material-ui/core';
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';

class MesheryVisualizeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false}
    this.handleClose = this.handleClose.bind(this)
    this.handlePerformanceOption = this.handlePerformanceOption.bind(this)
  }

  componentDidMount() {
    cytoscape.use(cxtmenu);

    const elements = [
      { data: { id: 'one', label: 'Node 1', endPoint: 'n1' }},
      { data: { id: 'two', label: 'Node 2', endPoint: 'n2' }},
      { data: { id: 'three', label: 'Node 3', endPoint: 'n3'}},
      { data: { id: 'four', label: 'Node 4', endPoint: 'n4' }},
      { data: { id: 'five', label: 'Node 5', endPoint: 'n5' }},
      { data: { id: 'six', label: 'Node 6', endPoint: 'n6'}},
      { data: { id: 'seven', label: 'Node 7', endPoint: 'n7' }},
      { data: { id: 'eight', label: 'Node 8', endPoint: 'n8' }},
      { data: { id: 'nine', label: 'Node 9', endPoint: 'n9'}},
      { data: { id: 'ten', label: 'Node 10', endPoint: 'n10' }},
      { data: { id: 'eleven', label: 'Node 11', endPoint: 'n11' }},
      { data: { id: 'twelve', label: 'Node 12', endPoint: 'n12'}},
      { data: { source: 'ten', target: 'two', label: '10 to 2' }},
      { data: { source: 'ten', target: 'three', label: '10 to 3' }},
      { data: { source: 'ten', target: 'four', label: '10 to 4' }},
      { data: { source: 'one', target: 'five', label: '1 to 5' }},
      { data: { source: 'six', target: 'eight', label: '6 to 8' }},
    ];

    let defaults = {
      menuRadius: 100, // the radius of the circular menu in pixels
      selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
      commands: [ // an array of commands to list in the menu or a function that returns the array
        {
          content: 'Load Test',
          select: this.handlePerformanceOption
        },{
          content: 'Stats',
          select: function(ele){
            console.log( ele.id() );
          },
        },
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
    const cyTarget = document.getElementById('cy')
    console.log("cytarget", cyTarget)
    let cy = cytoscape({
      container: cyTarget,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            width: 20,
            height: 20,
            label: 'data(label)'
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            label: 'data(label)'
          }
        }
      ],
      layout: {
        name: 'circle'
      },
    })
    cy.cxtmenu(defaults)
  }

  handleClose = () => {
    console.log("Modal Closed")
    this.setState((state) => {
      return {
        ...state,
        open: false
      }
    })
  }

  handlePerformanceOption = (ele) => {
    console.log("performance menu")
    console.log(ele)
    this.setState((state) => {
      return {
        ...state,
        open: true
      }
    });
  }

  render () {
    return (
      <>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="Performance Test"
        >
          <DialogTitle id="dialog-title">Performance Test</DialogTitle>
          <Container maxWidth={"xl"}>
            <Grid
              container
              direction="column"
              spacing={2}
            >
              <Grid item>
                <Grid
                  container
                  direction="row"
                  spacing={1}
                >
                  <Grid item xs={6}>
                    <TextField label="Test Name" variant="outlined" fullWidth />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="Service Mesh" variant="outlined" fullWidth />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField label="URL to Test" variant="outlined" required fullWidth />
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="row"
                  spacing={1}
                >
                  <Grid item xs>
                    <TextField label="Concurrent Request" variant="outlined" required fullWidth />
                  </Grid>
                  <Grid item xs>
                    <TextField label="Queries Per Second" variant="outlined" required fullWidth />
                  </Grid>
                  <Grid item xs>
                    <TextField label="Duration" variant="outlined" required fullWidth />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <RadioGroup row aria-label="loadGenerator" name="loadGenerator" defaultValue="wrk2">
                  <FormControlLabel
                    value="wrk2"
                    control={<Radio color="primary" />}
                    label="wrk2"
                  />
                  <FormControlLabel
                    value="fortio"
                    control={<Radio color="primary" />}
                    label="fortio"
                  />
                </RadioGroup>
              </Grid>
              <Grid item>
                <Grid container direction="row-reverse" justify="flex-start" alignItems="center">
                  <Button variant="contained" color="primary">Run Test</Button>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Dialog>
        <div id='cy' style={{width: '500px', height: '500px'}}>
        </div>
      </>
    )
  }
}

export default MesheryVisualizeComponent;
