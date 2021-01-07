import React, {Component} from 'react';
import {Map, Marker} from 'react-amap';

class App extends Component {
  constructor() {
    super();

    //坐标查询
    this.find = (e) => {
      this.setState({
        currentLocation: 'loading...',
        visible: true
      });
      this.geocoder.getAddress(e.lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress;
          this.setState({
            position: e.lnglat,
            currentLocation: address
          });
        }
      });
    };

    //map插件
    this.mapPlugins = ['ToolBar'];

    //new Marker
    this.markerEvents = {
      created: (instance) => {
      },
    };


    //new map
    this.amapEvents = {
      created: (mapInstance) => {
        this.map = mapInstance;
        this.polylineEditor = [];
        //RangingTool 插件
        mapInstance.plugin(['AMap.RangingTool'], () => {
          this.ruler = new AMap.RangingTool(mapInstance);
        });

        //MouseTool 插件
        mapInstance.plugin(['AMap.MouseTool'], () => {
          this.mouseTool = new AMap.MouseTool(mapInstance);
          AMap.event.addListener(this.mouseTool, 'draw', (e) => {
            //PolyEditor 插件
            mapInstance.plugin(['AMap.PolyEditor'], () => {
              this.polylineEditor.push(new AMap.PolyEditor(mapInstance, e.obj));
            });
          });
        });

        //Geocoder 逆地理编码
        mapInstance.plugin('AMap.Geocoder', () => {
          this.geocoder = new AMap.Geocoder();
        });
      }
    };

    //初始化 maker
    this.state = {
      position: {longitude: 0, latitude: 0},
      currentLocation: '',
      visible: false
    };
  }

  //关闭所有按钮
  closeAll() {
    this.ruler.turnOff();
    this.mouseTool.close();
    this.closeEdit();
    this.findClose();
  }
  //测距
  rangingOpen() {
    this.ruler.turnOn();
  }
  //关闭测距
  rangingClose() {
    this.ruler.turnOff();
  }

  //区域绘制
  drawPolygonOpen() {
    this.mouseTool.polygon();
  }

  drawPolygonClose() {
    this.mouseTool.close();
  }
  //

  EditOpen() {
    if (this.polylineEditor.length === 0) {
      alert('未发现编辑区域');
      return;
    }
    this.polylineEditor.map((item) => {
      item.open();
    });
  }
  EditClose() {
    this.polylineEditor.map((item) => {
      item.close();
    });
  }

  findOpen() {
    this.map.on('click', this.find);
  }

  findClose() {
    this.map.off('click', this.find);
  }

  render() {
    return (
      <div style={{
        width: 800,
        height: 600,
      }}
      >
        <Map events={this.amapEvents} plugins={this.mapPlugins}>
          <Marker
            events={this.markerEvents}
            position={this.state.position}
            visible={this.state.visible}
          />
        </Map>
        <button onClick={() => { this.rangingOpen(); }}>测距</button>
        <button onClick={() => { this.rangingClose(); }}>关闭测距</button>
        <span style={{margin: '0 10px'}} />
        <button onClick={() => { this.drawPolygonOpen(); }}>绘制区域</button>
        <button onClick={() => { this.drawPolygonClose(); }}>关闭绘制</button>
        <button onClick={() => { this.EditOpen(); }}>编辑区域</button>
        <button onClick={() => { this.EditClose(); }}>取消编辑</button>
        <span style={{margin: '0 10px'}} />
        <button onClick={() => { this.findOpen(); }}>查询点坐标</button>
        <button onClick={() => { this.findClose(); }}>关闭查询</button>
        <span style={{margin: '0 10px'}} />
        <button onClick={() => { this.closeAll(); }}>关闭鼠标</button>
        <div style={{
          padding: '4px',
          background: '#000',
          color: '#fff',
          position: 'absolute',
          top: '10px',
          left: '10px',
        }}
        >{this.state.currentLocation}</div>
      </div>
    );
  }
}

export default App;

