import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, InputSubmit } from '../../layout/Input';
import { useInput } from '../../../hooks';

function Dashboard({
  title,
  body,
  handleTitleChange,
  handleBodyChange,
  ...props
}) {
  return (
    <main className="md:mt-16 flex-auto flex-shrink-0">
      <div className="flex">
        <div className="w-1/5 bg-gray-200">
          <div className="px-2 py-4">
            <h2 className="text-center text-xl">Manage Blogs</h2>
            <div className="h-full mt-8 flex flex-col items-center">
              <p>List of blogs</p>
              <button>#1 BlogName</button>
              <button>#2 BlogName</button>
              <button>#3 BlogName</button>
              <button>#4 BlogName</button>
            </div>
          </div>
        </div>

        <div className="w-4/5 bg-gray-300 py-2 px-4">
          <form>
            <InputGroup
              name="title"
              value={title}
              handleChange={handleTitleChange}
              placeholder="Post Title"
            />
            <textarea
              name="body"
              value={body}
              onChange={handleBodyChange}
              placeholder="Post Content (You can use markdown)"
              className="bg-gray-100 rounded py-2 px-4 outline-none focus:shadow-outline w-full"
              cols="30"
              rows="10"
            ></textarea>
            <InputSubmit
              value="Create Post"
              classnames="w-1/2 max-w-sm mx-auto block mt-2"
            />
          </form>
        </div>
      </div>
    </main>
  );
}

Dashboard.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleBodyChange: PropTypes.func.isRequired
};

function DashboardContainer(props) {
  const [title, handleTitleChange] = useInput('');
  const [body, handleBodyChange] = useInput('');

  return (
    <Dashboard
      title={title}
      handleTitleChange={handleTitleChange}
      body={body}
      handleBodyChange={handleBodyChange}
    />
  );
}

export default DashboardContainer;
