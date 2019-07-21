import { Link } from '@reach/router'
import { Menu as EriMenu, ThemeToggle } from 'eri'
import * as React from 'react'

interface IProps {
  open: boolean
  handleMenuClose(): void
}

export default function Menu({ handleMenuClose, open }: IProps) {
  return (
    <EriMenu onClose={handleMenuClose} open={open}>
      <ThemeToggle />
      <ul>
        <li>
          <Link onClick={handleMenuClose} to="/">
            Home
          </Link>
        </li>
        <li>
          <Link onClick={handleMenuClose} to="jobs/create">
            Create job ad
          </Link>
        </li>
        <li>
          <Link onClick={handleMenuClose} to="sign-in">
            Sign in
          </Link>
        </li>
        <li>
          <Link onClick={handleMenuClose} to="sign-up">
            Sign up
          </Link>
        </li>
      </ul>
    </EriMenu>
  )
}
