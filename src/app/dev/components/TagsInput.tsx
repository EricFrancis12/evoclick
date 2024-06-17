import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

export default function TagsInput({ tags, setTags, tagSuggestions }: {
    tags: string[],
    setTags: (newTags: string[]) => any,
    tagSuggestions?: string[]
}) {
    const tagInputElement = useRef<HTMLInputElement>(null);

    const [tagSuggestionsVisible, setTagSuggestionsVisible] = useState<boolean>(false);
    const [inputSearchQuery, setInputSearchQuery] = useState<string>('');

    function handleMouseDown(tag: string) {
        addNewTag(tag);
        setInputSearchQuery('');
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!tagInputElement.current?.value) return;

        addNewTag(tagInputElement.current.value);
        tagInputElement.current.value = '';
        setInputSearchQuery('');
    }

    function addNewTag(tag: string) {
        if (tags.includes(tag)) return;
        setTags([...tags, tag]);
    }

    function deleteTag(tag: string) {
        const newTags = tags.filter(_tag => _tag !== tag);
        setTags(newTags);
    }

    return (
        <div className='flex flex-col justify-start items-start w-full'>
            <span>
                Tags
            </span>
            <div className='w-full p-1 bg-white' style={{ border: 'solid 1px grey', borderRadius: '6px' }}>
                <span>
                    {tags.map((tag, index) => (
                        <span key={index} className='inline-block rounded-full bg-gray-300 m-1 p-1'>
                            <div className='flex justify-center items-center gap-1 px-1'>
                                <span className='flex justify-center items-center ml-1'>
                                    {tag}
                                </span>
                                <span onClick={() => deleteTag(tag)}
                                    className='flex justify-center items-center rounded-full p-1 cursor-pointer hover:bg-gray-500'
                                    style={{ height: '16px', width: '16px', border: 'solid darkgrey 2px' }}
                                >
                                    <FontAwesomeIcon icon={faX} fontSize='8px' />
                                </span>
                            </div>
                        </span>
                    ))}
                    <span className='relative inline-block w-full'>
                        <form className='w-full' onSubmit={handleSubmit}>
                            <input ref={tagInputElement} placeholder='Type To Add Tags'
                                className='w-full m-1 p-1 bg-transparent'
                                style={{
                                    border: 'none',
                                    outline: 'none'
                                }}
                                onChange={e => setInputSearchQuery(e.target?.value ?? '')}
                                onFocus={() => setTagSuggestionsVisible(true)}
                                onBlur={() => setTagSuggestionsVisible(false)}
                            />
                        </form>
                        {tagSuggestionsVisible &&
                            <div className='absolute'>
                                {tagSuggestions && tagSuggestions
                                    .filter((tag: string) => (
                                        (!inputSearchQuery || tag.includes(inputSearchQuery)) && !tags.includes(tag)
                                    )).map((tag: string, index: number) => (
                                        <div key={index} onMouseDown={e => handleMouseDown(tag)}>
                                            {tag}
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </span>
                </span>
            </div>
        </div>
    )
}
