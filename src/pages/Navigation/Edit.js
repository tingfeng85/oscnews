import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './Edit.less';
import websiteIcon from '../../assets/website.svg';
import document from '../../dev-site/src/document.json';
import website from '../../source/website.json';
import addIcon from '../../assets/add-icon.png';

const blankData = {
  label: '添加网址',
  value: '',
  icon: addIcon,
};

export default class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      websiteSource: website,
      active: '',
      edit: blankData,
    };
  }
  componentDidMount() {
    const { websiteSource } = this.state;
    this.setListData();
    this.onHideEdit();
    const documentSource = {
      label: '开发文档',
      value: 'document',
      children: [],
    };
    documentSource.children = document.map((item) => {
      return {
        label: item.title,
        value: item.website,
        icon: item.logo || websiteIcon,
        type: 'doc',
      };
    });
    websiteSource.push(documentSource);
    this.setState({ websiteSource });
  }
  setListData(type) {
    let list = [];
    for (let i = 0; i < website.length; i += 1) {
      if (type) {
        if (website[i].value === type) {
          list = website[i].children;
          break;
        }
      } else if (website[i].children && website[i].children.length > 0) {
        list = website[i].children;
        break;
      }
    }
    this.setState({ list });
  }
  onClickTab(type) {
    this.setListData(type);
    this.setState({ active: type, edit: blankData });
  }
  onClickAdd(edit) {
    const { onClickAdd } = this.props;
    if (!edit.value) return;
    this.onHideEdit();
    onClickAdd && onClickAdd(edit);
  }
  handleAddNav(edit) {
    const { onClickGrid } = this.props;
    this.setState({ edit }, () => {
      onClickGrid && onClickGrid(edit);
    });
  }
  onShowEdit() {
    this.warpper.style.marginBottom = '0px';
  }
  onHideEdit() {
    this.warpper.style.marginBottom = `-${this.warpper.clientHeight}px`;
  }
  onChangeEdit(e) {
    const { websiteSource } = this.state;
    const value = e.target.value;
    const wb = {};
    wb.icon = '';
    wb.value = value;
    wb.label = value;
    websiteSource.forEach((item) => {
      item.children.forEach((itemChild) => {
        if (value.indexOf(itemChild.value) > -1) {
          wb.icon = itemChild.icon;
          // wb.label = itemChild.label;
        }
      });
    });
    this.setState({ edit: wb });
  }
  render() {
    const { active, edit, websiteSource } = this.state;
    return (
      <div className={styles.navEdit} ref={node => this.warpper = node}>
        <div className={classNames(styles.edit, { doc: active === 'document' })}>
          <img alt="" onError={e => e.target.src = websiteIcon} src={edit.icon} />
          <span className={styles.title}>{edit.label}</span>
          <input className={styles.url} onChange={this.onChangeEdit.bind(this)} value={edit.value} type="text" placeholder="输入网址" />
          <button className={styles.save} onClick={this.onClickAdd.bind(this, edit)}>确定</button>
        </div>
        <div className={styles.editTabList}>
          <div className={styles.category}>
            {websiteSource.map((item, idx) => {
              let isActive = item.value === active;
              if (active === '' && idx === 0) isActive = true;
              return (
                <span key={idx} onClick={this.onClickTab.bind(this, item.value)} className={classNames({ active: isActive })}>
                  {item.label}
                </span>
              );
            })}
          </div>
          {websiteSource.map((item, idx) => {
            return (
              <div
                key={idx}
                className={classNames(styles.list, {
                  show: item.value === active || (active === '' && idx === 0),
                  doc: active === 'document',
                })}
              >
                {item.children.map((_item, _idx) => (
                  <span key={_idx} onClick={this.handleAddNav.bind(this, _item)}>
                    <img alt={_item.label} onError={e => e.target.src = websiteIcon} src={_item.icon} />
                    <p>{_item.label}</p>
                  </span>
                ))}
              </div>
            );
          })}
        </div>
        <div className={styles.closeBtn} onClick={this.onHideEdit.bind(this)} />
      </div>
    );
  }
}
