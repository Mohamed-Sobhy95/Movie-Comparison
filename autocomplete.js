const createAutocomplete = ({root,renderOption,onOptionSelect ,inputValue,fetchData})=>{
    root.innerHTML = `
            <label for="search"><b>search</b></label>
            <input type="text" class="input" id="search">
            <div class="dropdown ">
                <div class="dropdown-menu">
                    <div class="dropdown-content results">
                    </div>
                </div>
            </div> 
        </div>
    `;
    const searchBox = root.querySelector('input');
    const dropdownEl = root.querySelector('.dropdown');
    const dropdownContent = root.querySelector('.dropdown-content.results');

    const searchHandler = async (event)=>{
        const items = await fetchData(event.target.value);
        if(items.length === 0){
            dropdownEl.classList.remove('is-active');
            return ;
        }
        dropdownContent.innerHTML = '';
        dropdownEl.classList.add('is-active');
        for (const item of items) {
            const itemEl = document.createElement('a');
            itemEl.classList.add('dropdown-item');
            itemEl.innerHTML = renderOption(item);
            itemEl.addEventListener('click',()=>{
                searchBox.value = inputValue(item) ;
                dropdownEl.classList.remove('is-active');
                // console.log(onOptionSelect);
                onOptionSelect(item);
                
            });
            dropdownContent.appendChild(itemEl);
        }

    };
    searchBox.addEventListener('input',debounce(searchHandler,500));
    document.addEventListener('click',event=>{
        if(! root.contains(event.target)){
            dropdownEl.classList.remove('is-active');
        }
    });
};