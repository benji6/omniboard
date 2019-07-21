import { Link } from '@reach/router'
import { Menu as EriMenu, ThemeToggle, ButtonGroup, Button } from 'eri'
import * as React from 'react'
import SignOutDialog from './SignOutDialog'

interface IProps {
  open: boolean
  handleMenuClose(): void
}

export default function Menu({ handleMenuClose, open }: IProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    handleMenuClose()
  }

  return (
    <>
      <EriMenu onClose={handleMenuClose} open={open}>
        <ButtonGroup>
          <Button
            danger
            onClick={() => setIsDialogOpen(true)}
            variant="secondary"
          >
            Sign out
          </Button>
        </ButtonGroup>
        <hr />
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
      <SignOutDialog onClose={handleDialogClose} open={isDialogOpen} />
    </>
  )
}
