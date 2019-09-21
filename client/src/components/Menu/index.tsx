import { Link } from '@reach/router'
import { Menu as EriMenu, ThemeToggle, ButtonGroup, Button } from 'eri'
import * as React from 'react'
import SignOutDialog from './SignOutDialog'
import { useAppState } from '../AppStateContainer'

interface IProps {
  open: boolean
  handleMenuClose(): void
}

export default function Menu({ handleMenuClose, open }: IProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [{ user }] = useAppState()

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    handleMenuClose()
  }

  return (
    <>
      <EriMenu onClose={handleMenuClose} open={open}>
        {user && (
          <>
            <p>
              Signed in as:
              <br />
              {user.email}
            </p>
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
          </>
        )}
        <ThemeToggle />
        <ul>
          <li>
            <Link onClick={handleMenuClose} to="/">
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link onClick={handleMenuClose} to="my-posts">
                  My posts
                </Link>
              </li>
              <li>
                <Link onClick={handleMenuClose} to="posts/create">
                  Create post
                </Link>
              </li>
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>
      </EriMenu>
      <SignOutDialog onClose={handleDialogClose} open={isDialogOpen} />
    </>
  )
}
