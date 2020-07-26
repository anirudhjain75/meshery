import { NoSsr } from "@material-ui/core";
import MesheryPerformanceComponent from "../components/MesheryPerformanceComponent";
import { updatepagepath } from "../lib/store";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Head from 'next/head';
import { getPath } from "../lib/path";
import MesheryVisualizeComponent from '../components/MesheryVisualizeComponent';

class Visualize extends React.Component {
  componentDidMount () {
    console.log(`path: ${getPath()}`);
    this.props.updatepagepath({ path: getPath() });
  }

  render () {
    return (
      <NoSsr>
        <Head>
          <title>Visualize | Meshery</title>
        </Head>
        <MesheryVisualizeComponent />
      </NoSsr>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updatepagepath: bindActionCreators(updatepagepath, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(Visualize);