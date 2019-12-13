# Elements Display

Can be specified for all breakpoints including the "Max" and "Only" versions. For example, `mediumMax` or `largeOnly`.
- `display`: sets the `display` type of the element at the breakpoints specified. All valid `display` types can be applied. 
- `flex`: sets the `flex` value of the element at the breakpoints specified. All valid `flex` values can be applied. 

```js
<Box
    display={{ mediumMax: 'none', large: 'flex' }}
    flex={{ large: 2 }}
>
    {...}
</Box>
```

<!-- STORY -->
