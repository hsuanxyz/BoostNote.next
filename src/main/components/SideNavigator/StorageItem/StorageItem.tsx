import React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import Storage from '../../../lib/db/Storage'
import FolderItem from './FolderItem'
import { Folder } from '../../../types'
import {
  StyledStorageItem,
  StyledStorageItemHeader,
  StyledNavLink,
  StyledStorageItemFolderList
} from './styled'

type StorageItemProps = {
  name: string
  storage: Storage
  removeStorage: (storageName: string) => Promise<void>
  createFolder: (storageName: string, folderPath: string) => Promise<void>
  removeFolder: (storageName: string, folderPath: string) => Promise<void>
  pathname: string
  active: boolean
}

@observer
class StorageItem extends React.Component<StorageItemProps> {
  @computed
  get tags(): string[] {
    const { storage } = this.props
    return [...storage.tagNoteIdSetMap.keys()].sort()
  }

  @computed
  get folders(): Folder[] {
    const { storage } = this.props
    const folderEntries = [...storage.folderMap.entries()]
    return folderEntries
      .map(([, folder]) => folder)
      .sort((folderA, folderB) => folderA.path.localeCompare(folderB.path))
  }

  removeStorage = () => {
    const { name, removeStorage } = this.props
    removeStorage(name)
  }

  createFolder = async (folderPath: string) => {
    const { name, createFolder } = this.props
    await createFolder(name, folderPath)
  }

  removeFolder = async (folderPath: string) => {
    const { name, removeFolder } = this.props
    await removeFolder(name, folderPath)
  }

  render() {
    const { name, pathname, active } = this.props

    return (
      <StyledStorageItem>
        <StyledStorageItemHeader>
          <StyledNavLink active={active} to={`/storages/${name}`}>
            {name}
          </StyledNavLink>
          <button onClick={this.removeStorage}>x</button>
        </StyledStorageItemHeader>
        <StyledStorageItemFolderList>
          {this.folders.map(folder => {
            const folderPathname =
              folder.path === '/'
                ? `/storages/${name}/notes`
                : `/storages/${name}/notes${folder.path}`
            const folderIsActive = folderPathname === pathname

            return (
              <FolderItem
                key={folder.path}
                storageName={name}
                folder={folder}
                createFolder={this.createFolder}
                removeFolder={this.removeFolder}
                active={folderIsActive}
              />
            )
          })}
        </StyledStorageItemFolderList>
        <ul>
          {this.tags.map(tag => {
            const tagIsActive = pathname === `/storages/${name}/tags/${tag}`
            return (
              <li key={tag}>
                <StyledNavLink
                  active={tagIsActive}
                  to={`/storages/${name}/tags/${tag}`}
                >
                  {tag}
                </StyledNavLink>
              </li>
            )
          })}
        </ul>
      </StyledStorageItem>
    )
  }
}

export default StorageItem
